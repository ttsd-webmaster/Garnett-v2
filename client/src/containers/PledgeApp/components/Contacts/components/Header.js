import React from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

export function Header(props) {
  return (
    <Subheader className="garnett-subheader contacts">
      {props.label}
      {props.index === 0 && (
        <span style={{float:'right'}}>
          <span className="garnett-filter" onClick={props.openPopover}> 
            {props.filterName}
          </span>
          <IconButton
            iconClassName={props.toggleIcon}
            className="reverse-toggle"
            onClick={props.reverse}
          />
        </span>
      )}
    </Subheader>
  )
}
