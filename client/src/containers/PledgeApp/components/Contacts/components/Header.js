import React from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

export function Header({
  label,
  index,
  openPopover,
  filterName,
  toggleIcon,
  reverse
}) {
  return (
    <Subheader className="garnett-subheader contacts">
      {label}
      {index === 0 && (
        <span style={{float:'right'}}>
          <span className="garnett-filter" onClick={openPopover}> 
            {filterName}
          </span>
          <IconButton
            iconClassName={toggleIcon}
            className="reverse-toggle"
            onClick={reverse}
          />
        </span>
      )}
    </Subheader>
  )
}
