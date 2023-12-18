// components/Auth/Login.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ loginData, setLoginData, handleLogin }) => {
  return (
    <div>
      <div className="back-button-section">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <h2>Login</h2>
      <form>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={loginData.email}
            placeholder='Email'
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder='Password'
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </div>
        <button type="button" onClick={handleLogin} className='login-button'>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
