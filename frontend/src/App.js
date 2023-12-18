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

<<<<<<< HEAD
const App = () => {
=======
function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
>>>>>>> 80567071df004c95b4c2490981771cacaa6404c5
  const [searchFilters, setSearchFilters] = useState({});
  const [filterParams, setFilterParams] = useState({});

  const applyFilters = (filters) => {
    setSearchFilters(filters.results);
    setFilterParams({ ...filters, apiUrl: null });
  };

<<<<<<< HEAD
=======
 const handleSignup = async () => {
  try {
    setLoading(true); // Add a loading state
    setError(''); // Clear any previous error

    const response = await axios.post('http://localhost:5000/signup', signupData);
    console.log(response.data);

    // Redirect to a success page or update UI accordingly
  } catch (error) {
    console.error(error.response.data);
    setError('Failed to sign up. Please check your input and try again.');
  } finally {
    setLoading(false); // Set loading to false after request completes
  }
};

const handleLogin = async () => {
  try {
    setLoading(true);
    setError('');

    const response = await axios.post('http://localhost:5000/login', loginData);
    console.log(response.data);

    // Redirect to a success page or update UI accordingly
  } catch (error) {
    console.error(error.response.data);
    setError('Invalid email or password. Please try again.');
  } finally {
    setLoading(false);
  }
};

>>>>>>> 80567071df004c95b4c2490981771cacaa6404c5
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