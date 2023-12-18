import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import genresData from '../genres/genres';
import './Random.css';

const Random = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenreDropdown, setSelectedGenreDropdown] = useState("all");
  const [remainingGenres, setRemainingGenres] = useState(genresData);
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedRuntime, setSelectedRuntime] = useState(120);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [remainingDecades, setRemainingDecades] = useState(getAllDecades());
  const [randomMovieDetails, setRandomMovieDetails] = useState(null);

  function getAllDecades() {
    return Array.from({ length: 12 }, (_, index) => {
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

  const handleRandomMovie = async () => {
    try {
      // Prepare the request payload with selected parameters
      const payload = {
        genres: selectedGenres.map(genre => genre.id),
        decades: selectedDecades,
        rating: selectedRating,
        runtime: selectedRuntime,
      };

      // Make a POST request to the server to get a random movie
      const response = await fetch('http://localhost:5000/random', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error in response");
      }

      const data = await response.json();

      // Set the details of the selected random movie
      setRandomMovieDetails(data.randomMovie);

    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="random-container">
      <div className="back-button-section">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <div className="random-content">
        <h2>Random Movie Generator</h2>
        <form className="random-form">
        <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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

          <button type="button" onClick={handleRandomMovie}>
            Generate Random Movie
          </button>
        </form>

        {randomMovieDetails && (
          <div className="random-movie-details">
            {/* Display the details of the selected random movie */}
            <img src={`https://image.tmdb.org/t/p/w500/${randomMovieDetails.poster_path}`} alt="Movie Poster" />
            <div className="movie-info">
              <h3>{randomMovieDetails.title}</h3>
              <p>{randomMovieDetails.genres.map(genre => genre.name).join(', ')}</p>
              <p>Release Date: {randomMovieDetails.release_date}</p>
              <p>{randomMovieDetails.overview}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Random;
