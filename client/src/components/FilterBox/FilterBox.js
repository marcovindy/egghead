import React, { useState } from 'react';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';

const FilterBox = () => {
  const [categories, setCategories] = useState([
    'Category 1',
    'Category 2',
    'Category 3',
  ]);

  return (
    <div>
      <h3>Filters:</h3>
      <div>
        <h5>Language:</h5>
        <select>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
        </select>
      </div>
      <div>
        <h5>Categories:</h5>
        <CheckboxGroup name="categories" options={categories} />
      </div>
      <div>
        <h5>Length:</h5>
        <select>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBox;
