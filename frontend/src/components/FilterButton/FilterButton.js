import React, { useState } from 'react';
import Filter from '../Filter/Filter';
import './FilterButton.css'

const FilterButton = ({ applyFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className='filter-button-container'>
      <button onClick={handleFilterClick}>Filters</button>
      {isFilterOpen && <Filter applyFilters={applyFilters} />}
    </div>
  );
};

export default FilterButton;
