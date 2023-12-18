import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FilterResult.css';
import genres from '../genres/genres';

const FilterResult = ({ selectedFilters }) => {
  const [filterResults, setFilterResults] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY || '';
  const genres = selectedFilters.genres || [];
  const decades = selectedFilters.decades || [];
  const rating = selectedFilters.rating || 0;
  const runtime = selectedFilters.runtime || 0;

  useEffect(() => {
    const fetchFilterResults = async () => {
      try {
        // Construct the API query based on the selected filters
        const queryParams = `&with_genres=${genres.join('|')}&primary_release_date.gte=${decades[0]}-01-01&primary_release_date.lte=${decades[decades.length - 1]}-12-31&vote_average.lte=${rating}&with_runtime.lte=${runtime}`;

        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}${queryParams}`
          );

        if (!response.ok) {
          throw new Error('Error in response');
        }

        const data = await response.json();
        setFilterResults(data.results);
      } catch (error) {
        console.error('Error fetching filter results:', error.message);
      }
    };

    fetchFilterResults();
  }, [selectedFilters, apiKey]);

  const getGenreNames = (genreIds) => {
    return genreIds.map((genreId) => genres.find((genre) => genre.id === genreId)?.name || 'Unknown');
  };

  return (
    <div className="filter-result-page">
      <div className="back-button-section">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <div className='filter-result-query'>
        <h2>Filter Results: {filterResults.length} Results</h2>
      </div>
      <div className="filter-results-container">
        {filterResults.map((result) => (
          <div key={result.id} className="filter-result-item">
            <a href={`https://www.themoviedb.org/movie/${result.id}`} target="_blank" rel="noopener noreferrer">
              <img
                src={result.poster_path ? `https://image.tmdb.org/t/p/original${result.poster_path}` : '/images/No-Image-Placeholder.png'}
                alt={result.title}
              />
            </a>
            <div className="movie-details">
              <p className="movie-title">{result.title}</p>
              <p className="movie-genres">Genres: {getGenreNames(result.genre_ids).join(', ')}</p>
              <p className="movie-rating">Rating: {result.vote_average ? result.vote_average.toFixed(1) : 'N/A'}</p>
              <p className="movie-release-date">Release Date: {result.release_date || 'N/A'}</p>
              <p className="movie-overview">{result.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterResult;