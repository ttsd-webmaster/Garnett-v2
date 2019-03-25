// @flow

import { filters } from '../data/filters.js';

import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Paper from 'material-ui/Paper';

type Props = {
  value: string,
  filterData: () => void
};

export default function Filter(props: Props) {
  return (
    <Paper className="filter-container">
      <SelectField
        style={{margin:'10px'}}
        floatingLabelText="Filters"
        value={props.value}
        onChange={(event, index, value) => props.filterData(props.value)}
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
