import React from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export function Filter(props) {
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
        <MenuItem
          primaryText="Last Name"
          insetChildren
          checked={props.filterName === 'Last Name'}
          onClick={() => props.setFilter('Last Name')}
        />
        <MenuItem
          primaryText="First Name"
          insetChildren
          checked={props.filterName === 'First Name'}
          onClick={() => props.setFilter('First Name')}
        />
        <MenuItem
          primaryText="Year"
          insetChildren
          checked={props.filterName === 'Year'}
          onClick={() => props.setFilter('Year')}
        />
        <MenuItem
          primaryText="Major"
          insetChildren
          checked={props.filterName === 'Major'}
          onClick={() => props.setFilter('Major')}
        />
        <MenuItem
          primaryText="Total Merits"
          insetChildren
          checked={props.filterName === 'Total Merits'}
          onClick={() => props.setFilter('Total Merits')}
        />
      </Menu>
    </Popover>
  )
}