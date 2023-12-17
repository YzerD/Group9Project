import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SearchResult.css';
import genres from '../genres/genres';

const SearchResult = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const apiKey = process.env.REACT_APP_API_KEY || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error('Error in response');
        }

        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.error('Error fetching search results:', error.message);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [query, apiKey]);

  const getGenreNames = (genreIds) => {
    return genreIds.map((genreId) => genres.find((genre) => genre.id === genreId)?.name || 'Unknown');
  };

  return (
    <div className="search-result-page">
      <div className="back-button-section">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <div className='search-result-query'>
        <h2>Search Results for {query}: {searchResults.length} Results</h2>
      </div>
      <div className="search-results-container">
        {searchResults.map((result) => (
          <div key={result.id} className="search-result-item">
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

export default SearchResult;
