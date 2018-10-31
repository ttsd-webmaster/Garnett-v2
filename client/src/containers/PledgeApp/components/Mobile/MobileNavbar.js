import { getTabStyle } from 'helpers/functions';

import React from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

export function MobileNavbar({
  index,
  status,
  handleChange
}) {
  return (
    <BottomNavigation
      className="bottom-tabs"
      selectedIndex={index}
    >
      <BottomNavigationItem
        label="Merits"
        icon={
          <i
            style={getTabStyle(index === 0)}
            className="icon-star"
          />
        }
        onClick={() => handleChange(0)}
      />
      <BottomNavigationItem
        label={
          status === 'pledge'
            ? 'Pbros'
            : 'Pledges'
        }
        icon={
          <i
            style={getTabStyle(index === 1)}
            className="icon-users"
          />
        }
        onClick={() => handleChange(1)}
      />
      <BottomNavigationItem
        label="Brothers"
        icon={
          <i
            style={getTabStyle(index === 2)}
            className="icon-address-book"
          />
        }
        onClick={() => handleChange(2)}
      />
      <BottomNavigationItem
        label="Settings"
        icon={
          <i
            style={getTabStyle(index === 3)}
            className="icon-cog"
          />
        }
        onClick={() => handleChange(3)}
      />
    </BottomNavigation>
  )
}
