import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });

  const handleSignup = () => {
    // Implement signup logic here
    console.log('Signing up with:', signupData);
  };

  return (
    <div>
       <div className="back-button-section">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <h2>Sign Up</h2>
      <form>
        <div className='input-group'>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder='Username'
            value={signupData.username}
            onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
          />
        </div>
        <div className='input-group'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder='Email'
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          />
        </div>
        <div className='input-group'>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder='Password'
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          />
        </div>
        <button type="button" onClick={handleSignup} className='signup-button'>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
