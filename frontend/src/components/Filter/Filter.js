import React, { useState } from 'react';
import genresData from '../genres/genres';
import './Filter.css';
import { useNavigate } from 'react-router-dom';

const Filter = ({ applyFilters }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenreDropdown, setSelectedGenreDropdown] = useState("all");
  const [remainingGenres, setRemainingGenres] = useState(genresData);
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedRuntime, setSelectedRuntime] = useState(120);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [remainingDecades, setRemainingDecades] = useState(getAllDecades());
  const apiKey = process.env.REACT_APP_API_KEY || '';
  const navigate = useNavigate();

  function getAllDecades() {
    return Array.from({ length: 13 }, (_, index) => {
      const startYear = 1900 + index * 10;
      return `${startYear}-${startYear + 9}`;
    });
  }

  const handleGenreSelect = (selectedGenre) => {
    const newSelectedGenres = [...selectedGenres, selectedGenre];
    const newRemainingGenres = remainingGenres.filter(genre => genre.id !== selectedGenre.id);

    setSelectedGenres(newSelectedGenres);
    setRemainingGenres(newRemainingGenres);
    setSelectedGenreDropdown("all");
  };

  const handleDecadeSelect = (selectedDecade) => {
    const newSelectedDecades = [...selectedDecades, selectedDecade];
    const newRemainingDecades = remainingDecades.filter(decade => decade !== selectedDecade);

    setSelectedDecades(newSelectedDecades);
    setRemainingDecades(newRemainingDecades);
  };

  const removeGenreTag = (removedGenre) => {
    const newSelectedGenres = selectedGenres.filter(genre => genre.id !== removedGenre.id);
    const newRemainingGenres = [...remainingGenres, removedGenre];

    setSelectedGenres(newSelectedGenres);
    setRemainingGenres(newRemainingGenres);
    setSelectedGenreDropdown("all");
  };

  const removeDecadeTag = (removedDecade) => {
    const newSelectedDecades = selectedDecades.filter(decade => decade !== removedDecade);
    const newRemainingDecades = [...remainingDecades, removedDecade];

    setSelectedDecades(newSelectedDecades);
    setRemainingDecades(newRemainingDecades);
  };

  const handleRatingChange = (e) => {
    setSelectedRating(parseFloat(e.target.value));
  };

  const handleRuntimeChange = (e) => {
    setSelectedRuntime(parseInt(e.target.value, 10));
  };

  const handleDecadeChange = (e) => {
    const selectedDecade = e.target.value;

    if (!selectedDecades.includes(selectedDecade)) {
      handleDecadeSelect(selectedDecade);
    }
  };

  const clearAllSelectedGenres = () => {
    setRemainingGenres([...remainingGenres, ...selectedGenres]);
    setSelectedGenres([]);
  };

  const clearAllSelectedDecades = () => {
    setRemainingDecades([...remainingDecades, ...selectedDecades]);
    setSelectedDecades([]);
  };

  const handleApplyFilters = async () => {
    try {
      const defaultGenres = selectedGenres.length === 0 ? genresData.map(genre => genre.id).join('|') : '';
      const defaultDecades = selectedDecades.length === 0 ? '1900-01-01|2029-12-31' : '';
  
      // Split defaultDecades into lower and upper bounds
      const [lowerBound, upperBound] = defaultDecades.split('|');
      
      const genreParam = defaultGenres || `with_genres=${selectedGenres.map(genre => genre.id).join('|')}`;
      console.log("Genre Parameters: ", defaultGenres);
      const decadeParam = defaultDecades
        ? `primary_release_date.gte=${lowerBound}&primary_release_date.lte=${upperBound}`
        : '';
      console.log("Decade Parameters: ", decadeParam);
      const ratingParam = `vote_average.lte=${selectedRating}`;
      console.log("Rating Parameter: ", ratingParam);
      const runtimeParam = `with_runtime.lte=${selectedRuntime}`;
      console.log("Runtime Parameter: ", runtimeParam);
  
      const queryParams = [genreParam, decadeParam, ratingParam, runtimeParam].filter(param => param !== '').join('&');
      console.log("Query Parameters: ", queryParams);
      const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${queryParams}`;
      console.log("APIURL: ", apiUrl);
  
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Error in response");
      }
  
      const data = await response.json();
  
      applyFilters({ results: data.results, apiUrl });
  
      navigate('/filter');
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="filter-container">
      <div className="filter-group">
        <label htmlFor="genre">Genre:</label>
        <div className="tag-container">
          {selectedGenres.map(genre => (
            <div key={genre.id} className="tag" onClick={() => removeGenreTag(genre)}>
              {genre.name}
              <span className="tag-remove" onClick={() => removeGenreTag(genre)}>x</span>
            </div>
          ))}
          {selectedGenres.length > 0 && (
            <div className="clear-all" onClick={clearAllSelectedGenres}>
              Clear All
            </div>
          )}
        </div>
        <select
          id="genre"
          name="genre"
          value={selectedGenreDropdown}
          onChange={(e) => {
            const selectedGenre = remainingGenres.find(genre => genre.id === parseInt(e.target.value));
            setSelectedGenreDropdown(selectedGenre.id);
            handleGenreSelect(selectedGenre);
          }}
        >
          <option value="all">All</option>
          {remainingGenres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="decade">Decade:</label>
        <div className="tag-container">
          {selectedDecades.map(decade => (
            <div key={decade} className="tag" onClick={() => removeDecadeTag(decade)}>
              {decade}
              <span className="tag-remove" onClick={() => removeDecadeTag(decade)}>x</span>
            </div>
          ))}
          {selectedDecades.length > 0 && (
            <div className="clear-all" onClick={clearAllSelectedDecades}>
              Clear All
            </div>
          )}
        </div>
        <select
          id="decade"
          name="decade"
          value={selectedDecades.length > 0 ? selectedDecades[0] : "all"}
          onChange={handleDecadeChange}
        >
          <option value="all">All</option>
          {remainingDecades.map(decade => (
            <option key={decade} value={decade}>
              {decade}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="rating">Ratings: Under {selectedRating.toFixed(1)}</label>
        <input
          type="range"
          id="rating"
          name="rating"
          min="0"
          max="10"
          step="0.1"
          value={selectedRating}
          onChange={handleRatingChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="runtime">Runtime: Under {selectedRuntime} minutes</label>
        <input
          type="range"
          id="runtime"
          name="runtime"
          min="10"
          max="240"
          step="1"
          value={selectedRuntime}
          onChange={handleRuntimeChange}
        />
      </div>

      <button type="button" onClick={handleApplyFilters}>
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;
