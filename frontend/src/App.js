// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Trending from './components/Trending/Trending';
import NowPlaying from './components/NowPlaying/NowPlaying';
import Upcoming from './components/Upcoming/Upcoming';
import SearchResult from './components/SearchResult/SearchResult';
import Random from './components/Random/Random';
import RandomButton from './components/RandomButton/RandomButton';
import FilterButton from './components/FilterButton/FilterButton';
import FilterResult from './components/FilterResult/FilterResult';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';

function App() {
  const [searchFilters, setSearchFilters] = useState({});
  const [filterParams, setFilterParams] = useState({});
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const applyFilters = (filters) => {
    setSearchFilters(filters.results);
    setFilterParams({ ...filters, apiUrl: null });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/signup', signupData);
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Router>
      <div className='app'>
        {/* Header is displayed on every page */}
        <Header />
        <div className='searchbar-section'>
          <div className='centered-searchbar'>
            {/* Flex grid for SearchBar and FilterButton */}
            <div className='searchbar-container'>
              {/* SearchBar component for user input */}
              <SearchBar />
            </div>
            {/* FilterButton component for applying filters */}
            <FilterButton applyFilters={applyFilters} />
          </div>
        </div>
        {/* Add the link to the Random component */}
        <RandomButton />
        <Routes>
          {/* Home page */}
          <Route
            path='/'
            element={
              <div>
                <NowPlaying />
                <Upcoming />
                <Trending />
              </div>
            }
          />
          {/* Search result page with applied filters */}
          <Route
            path='/search'
            element={<SearchResult filters={searchFilters} />}
          />
          {/* Filter result page with applied filters */}
          <Route
            path='/filter'
            element={<FilterResult selectedFilters={filterParams} />}
          />
          {/* Random Movie Generator page */}
          <Route path='/random' element={<Random />} />
          {/* Authentication routes */}
          <Route
            path='/signup'
            element={
              <Signup
                signupData={signupData}
                setSignupData={setSignupData}
                handleSignup={handleSignup}
              />
            }
          />
          <Route
            path='/login'
            element={
              <Login
                loginData={loginData}
                setLoginData={setLoginData}
                handleLogin={handleLogin}
              />
            }
          />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;