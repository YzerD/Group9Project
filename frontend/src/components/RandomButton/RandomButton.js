import React from 'react';
import { Link } from 'react-router-dom';
import './RandomButton.css'

const RandomButton = () => {
    return (
        <div className='random-button-container'>
            <Link to="/random" className="random-button">
                Random Movie Generator
            </Link>
        </div>
    );
};

export default RandomButton;