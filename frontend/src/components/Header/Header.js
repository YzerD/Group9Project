import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <div className='left'>
        <Link to='/' className='logo'>
          <img src="/images/logo.png" alt="Logo"/>
          <span>Seenima</span>
        </Link>
      </div>
      <div className='right'>
        <div className='profile-icon'></div>
        <Link to='/login'>
          <button>Login</button>
        </Link>
        <Link to='/signup'>
          <button>Sign Up</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
