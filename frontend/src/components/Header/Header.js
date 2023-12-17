import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header>
            <div className='left'>
                <img src="/images/logo.png" alt="Logo"/>
                <span>Seenima</span>
            </div>
        </header>
    );
};

export default Header;