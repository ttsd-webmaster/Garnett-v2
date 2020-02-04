// @flow

import React, { Fragment } from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

type Props = {
  title: string,
  openPopover: () => void,
  isReversed: boolean,
  reverse: () => void
};

export const FilterHeader = ({
  title,
  openPopover,
  isReversed,
  reverse,
  ...rest,
}: Props) => (
  <Subheader className="garnett-subheader" {...rest}>
    <Fragment>
      {title || (isReversed ? 'Oldest' : 'Recent')}
      <span className="garnett-filter-container">
        {openPopover && (
          <span className="garnett-filter" onClick={openPopover}>
            <i className="icon-sort-alt-down" />
            <span style={{ marginLeft: '5px'}}>Sort</span>
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
);
