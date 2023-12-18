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
        </Routes>
      </div>
    </Router>
  );
};

export default App;