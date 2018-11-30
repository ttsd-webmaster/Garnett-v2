import React, { Fragment } from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

export function FilterHeader({
  status,
  title,
  filterName,
  openPopover,
  toggleIcon,
  isReversed,
  reverse,
  ...rest
}) {
  return (
    <Subheader className="garnett-subheader" {...rest}>
      {status === 'pledge' ? (
        "Pledge Brothers"
      ) : (
        <Fragment>
          {title}
          <span className="garnett-filter">
            {filterName && openPopover && (
              <span className="garnett-filter" onClick={openPopover}> 
                {filterName}
              </span>
            )}
            {reverse && (
              <IconButton
                iconClassName={
                  isReversed ? 'icon-up-open-mini' : 'icon-down-open-mini'
                }
                className="reverse-toggle"
                onClick={reverse}
              />
            )}
          </span>
        </Fragment>
      )}
    </Subheader>
  )
}
