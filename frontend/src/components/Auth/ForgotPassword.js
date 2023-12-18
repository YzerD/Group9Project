// components/Auth/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      // Send a request to the server to initiate the password reset process
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      console.log(response.data);
      // Display a message to the user indicating that the password reset link has been sent
    } catch (error) {
      console.error(error.response.data);
      // Handle error and inform the user
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="button" onClick={handleForgotPassword}>
          Forgot Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
