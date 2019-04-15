// @flow

import React from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

type Props = {
  open: boolean,
  anchorEl: HTMLElement,
  closePopover: () => void,
  filters: Array<string>,
  filterName: string,
  setFilter: () => void
};

export function Filter(props: Props) {
  const {
    open,
    anchorEl,
    closePopover,
    filters,
    filterName,
    setFilter
  } = props;
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      onRequestClose={closePopover}
      animation={PopoverAnimationVertical}
    >
      <Menu>
        {filters.map((filter) => (
          <MenuItem
            key={filter}
            primaryText={filter}
            insetChildren
            checked={filter === filterName}
            onClick={() => setFilter(filter)}
          />
        ))}
      </Menu>
    </Popover>
  )
}
