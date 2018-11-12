import React from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export function Filter({
  open,
  anchorEl,
  closePopover,
  filters,
  filterName,
  setFilter
}) {
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
