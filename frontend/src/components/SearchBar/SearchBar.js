import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
    const [movieInfo, setMovieInfo] = useState("");
    const navigate = useNavigate();

    const handleFetch = () => {
        navigate(`/search?query=${encodeURIComponent(movieInfo)}`);
    };

    const handleClear = () => {
        setMovieInfo("");
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleFetch();
        }
    };

    return (
        <div className="searchBar">
            <div className='button'>
                <button
                    onClick={handleFetch}
                    className="search">Search</button>
                <div className="search-input-container">
                    <input
                        type="text"
                        value={movieInfo}
                        onChange={(e) => setMovieInfo(e.target.value)}
                        placeholder="Search For A Movie"
                        onKeyDown={handleKeyDown}
                    />
                    {movieInfo && (
                        <button className="clear-button" onClick={handleClear}>
                            &#x2715;
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
