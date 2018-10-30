import { getTabStyle } from 'helpers/functions';

import React from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

export function MobileNavbar(props) {
  return (
    <BottomNavigation
      className="bottom-tabs"
      selectedIndex={props.index}
    >
      <BottomNavigationItem
        label="Merits"
        icon={
          <i
            style={getTabStyle(props.index === 0)}
            className="icon-star"
          />
        }
        onClick={() => props.handleChange(0)}
      />
      <BottomNavigationItem
        label={
          props.status === 'pledge'
            ? 'Pbros'
            : 'Pledges'
        }
        icon={
          <i
            style={getTabStyle(props.index === 1)}
            className="icon-users"
          />
        }
        onClick={() => props.handleChange(1)}
      />
      <BottomNavigationItem
        label="Brothers"
        icon={
          <i
            style={getTabStyle(props.index === 2)}
            className="icon-address-book"
          />
        }
        onClick={() => props.handleChange(2)}
      />
      <BottomNavigationItem
        label="Settings"
        icon={
          <i
            style={getTabStyle(props.index === 3)}
            className="icon-cog"
          />
        }
        onClick={() => props.handleChange(3)}
      />
    </BottomNavigation>
  )
}
