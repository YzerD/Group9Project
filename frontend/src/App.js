import React, { useState } from 'react';
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
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

const App = () => {
  const [searchFilters, setSearchFilters] = useState({});
  const [filterParams, setFilterParams] = useState({});

  const applyFilters = (filters) => {
    setSearchFilters(filters.results);
    setFilterParams({ ...filters, apiUrl: null });
  };

  return (
    <Router>
      <div className='app'>
        <Header />
        <div className='searchbar-section'>
          <div className='centered-searchbar'>
            <div className='searchbar-container'>
              <SearchBar />
            </div>
            <FilterButton applyFilters={applyFilters} />
          </div>
        </div>
        <RandomButton />
        <Routes>
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
          <Route path='/search' element={<SearchResult filters={searchFilters} />} />
          <Route path='/filter' element={<FilterResult selectedFilters={filterParams} />} />
          <Route path='/random' element={<Random />} />
          {/* Add routes for Login and Signup */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
