import { filters } from '../data/filters.js';

import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Paper from 'material-ui/Paper';

export default function Filter({ value, filterData }) {
  return (
    <Paper className="filter-container">
      <SelectField
        style={{margin:'10px'}}
        floatingLabelText="Filters"
        value={value}
        onChange={(event, index, value) => filterData(value)}
      >
        {filters.map((filter, i) => (
          <MenuItem
            key={i}
            value={i}
            primaryText={filter}
          />
        ))}
      </SelectField>
    </Paper>
  )
}
