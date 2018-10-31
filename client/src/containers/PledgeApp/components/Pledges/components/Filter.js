import React from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export function Filter({
  open,
  anchorEl,
  closePopover,
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
        <MenuItem
          primaryText="Last Name"
          insetChildren
          checked={filterName === 'Last Name'}
          onClick={() => setFilter('Last Name')}
        />
        <MenuItem
          primaryText="First Name"
          insetChildren
          checked={filterName === 'First Name'}
          onClick={() => setFilter('First Name')}
        />
        <MenuItem
          primaryText="Year"
          insetChildren
          checked={filterName === 'Year'}
          onClick={() => setFilter('Year')}
        />
        <MenuItem
          primaryText="Major"
          insetChildren
          checked={filterName === 'Major'}
          onClick={() => setFilter('Major')}
        />
        <MenuItem
          primaryText="Total Merits"
          insetChildren
          checked={filterName === 'Total Merits'}
          onClick={() => setFilter('Total Merits')}
        />
      </Menu>
    </Popover>
  )
}
