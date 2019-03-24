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
  return (
    <Popover
      open={props.open}
      anchorEl={props.anchorEl}
      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      onRequestClose={props.closePopover}
      animation={PopoverAnimationVertical}
    >
      <Menu>
        {props.filters.map((filter) => (
          <MenuItem
            key={filter}
            primaryText={filter}
            insetChildren
            checked={filter === props.filterName}
            onClick={() => props.setFilter(filter)}
          />
        ))}
      </Menu>
    </Popover>
  )
}
