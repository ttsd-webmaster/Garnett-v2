// @flow

import React, { Fragment } from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

type Props = {
  title: string,
  filterName: string,
  openPopover: () => void,
  isReversed: boolean,
  reverse: () => void
};

export function FilterHeader(props: Props) {
  const {
    title,
    filterName,
    openPopover,
    isReversed,
    reverse,
    ...rest
  } = props;
  return (
    <Subheader className="garnett-subheader" {...rest}>
      <Fragment>
        { title || (isReversed ? 'Oldest' : 'Recent') }
        <span className="garnett-filter-container">
          {filterName && openPopover && (
            <span className="garnett-filter" onClick={openPopover}>
              { filterName }
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
    </Subheader>
  )
}
