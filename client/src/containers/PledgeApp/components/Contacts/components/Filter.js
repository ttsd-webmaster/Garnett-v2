import React from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export function Filter(props) {
  return (
    <Popover
      open={props.openPopover}
      anchorEl={props.anchorEl}
      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      onRequestClose={props.closePopover}
      animation={PopoverAnimationVertical}
    >
      <Menu>
        <MenuItem
          primaryText="Active"
          insetChildren
          checked={props.filterName === 'Active'}
          onClick={() => props.setFilter('Active')}
        />
        <MenuItem
          primaryText="Alumni"
          insetChildren
          checked={props.filterName === 'Alumni'}
          onClick={() => props.setFilter('Alumni')}
        />
        <MenuItem
          primaryText="Class"
          insetChildren
          checked={props.filterName === 'Class'}
          onClick={() => props.setFilter('Class')}
        />
        <MenuItem
          primaryText="Major"
          insetChildren
          checked={props.filterName === 'Major'}
          onClick={() => props.setFilter('Major')}
        />
        <MenuItem
          primaryText="Year"
          insetChildren
          checked={props.filterName === 'Year'}
          onClick={() => props.setFilter('Year')}
        />
        <MenuItem
          primaryText="First Name"
          insetChildren
          checked={props.filterName === 'First Name'}
          onClick={() => props.setFilter('First Name')}
        />
        <MenuItem
          primaryText="Last Name"
          insetChildren
          checked={props.filterName === 'Last Name'}
          onClick={() => props.setFilter('Last Name')}
        />
        <MenuItem
          primaryText="Personality Type"
          insetChildren
          checked={props.filterName === 'Personality Type'}
          onClick={() => props.setFilter('Personality Type')}
        />
      </Menu>
    </Popover>
  )
}
