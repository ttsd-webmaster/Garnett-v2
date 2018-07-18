import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Paper from 'material-ui/Paper';

const filters = [
  'Nu Majors',
  'Xi Majors',
  'Omicron Majors',
  'Pi Majors',
  'Rho Majors',
  'Sigma Majors',
  'Nu Years',
  'Xi Years',
  'Omicron Years',
  'Pi Years',
  'Rho Years',
  'Sigma Years',
  'Nu Genders',
  'Xi Genders',
  'Omicron Genders',
  'Pi Genders',
  'Rho Genders',
  'Sigma Genders',
  'Nu Class Majors',
  'Xi Class Majors',
  'Omicron Class Majors',
  'Pi Class Majors',
  'Rho Class Majors',
  'Sigma Class Majors'
];

export default function Filter(props) {
  return (
    <Paper className="filter-container">
      <SelectField
        style={{margin:'10px'}}
        floatingLabelText="Filters"
        value={props.value}
        onChange={(event, index, value) => props.filterData(value)}
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
