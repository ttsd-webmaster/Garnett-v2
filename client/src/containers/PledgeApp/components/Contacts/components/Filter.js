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
          primaryText="Active"
          insetChildren
          checked={filterName === 'Active'}
          onClick={() => setFilter('Active')}
        />
        <MenuItem
          primaryText="Alumni"
          insetChildren
          checked={filterName === 'Alumni'}
          onClick={() => setFilter('Alumni')}
        />
        <MenuItem
          primaryText="Class"
          insetChildren
          checked={filterName === 'Class'}
          onClick={() => setFilter('Class')}
        />
        <MenuItem
          primaryText="Major"
          insetChildren
          checked={filterName === 'Major'}
          onClick={() => setFilter('Major')}
        />
        <MenuItem
          primaryText="Year"
          insetChildren
          checked={filterName === 'Year'}
          onClick={() => setFilter('Year')}
        />
        <MenuItem
          primaryText="First Name"
          insetChildren
          checked={filterName === 'First Name'}
          onClick={() => setFilter('First Name')}
        />
        <MenuItem
          primaryText="Last Name"
          insetChildren
          checked={filterName === 'Last Name'}
          onClick={() => setFilter('Last Name')}
        />
        <MenuItem
          primaryText="Personality Type"
          insetChildren
          checked={filterName === 'Personality Type'}
          onClick={() => setFilter('Personality Type')}
        />
      </Menu>
    </Popover>
  )
}
