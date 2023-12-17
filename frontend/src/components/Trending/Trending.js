import React, { useState, useEffect } from 'react';
import './Trending.css';
import genres from '../genres/genres';

const Trending = () => {
    const [movieData, setMovieData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiKey = process.env.REACT_APP_API_KEY || '';

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1&language=en-US`);
                if (!response.ok) {
                    throw new Error('Error in response');
                }

                const data = await response.json();
                setMovieData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingMovies();
    }, [apiKey]);

    const roundToTenths = (number) => {
        return number.toFixed(1);
    };

    const getGenreNames = (genreIds) => {
        return genreIds.map((genreId) => genres.find((genre) => genre.id === genreId)?.name || 'Unknown');
    };


    return (
        <div className="trending-contents">
            <h2>Top Rated Movies</h2>
            <div className='trending-section'>
                {loading && <div>Loading......</div>}
                {error && <div>Error: {error}</div>}
                {movieData && (
                    <div>
                        <div className="movie-list">
                            {movieData.results.slice(0, 10).map((movie, index) => (
                                <div key={index} className="movie-item">
                                    <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
                                        <img className="post" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
                                    </a>
                                    <p className="movie-title">{movie.title}</p>
                                    <p>{getGenreNames(movie.genre_ids).join(', ')}</p>
                                    <p className="movie-rating">Rating: {roundToTenths(movie.vote_average)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trending;
