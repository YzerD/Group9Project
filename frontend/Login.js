// components/Auth/Login.js
import React from 'react';

const Login = ({ loginData, setLoginData, handleLogin }) => {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
