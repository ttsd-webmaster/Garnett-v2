import React, { Fragment } from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

export function FilterHeader({
  state,
  title,
  filterName,
  openPopover,
  toggleIcon,
  reverse,
  ...rest
}) {
  return (
    <Subheader className="garnett-subheader" {...rest}>
      {state && state.status === 'pledge' ? (
        "Pledge Brothers"
      ) : (
        <Fragment>
          {title}
          <span style={{ float:'right' }}>
            {filterName && openPopover && (
              <span className="garnett-filter" onClick={openPopover}> 
                {filterName}
              </span>
            )}
            <IconButton
              iconClassName={toggleIcon}
              className="reverse-toggle"
              onClick={reverse}
            />
          </span>
        </Fragment>
      )}
    </Subheader>
  )
}
