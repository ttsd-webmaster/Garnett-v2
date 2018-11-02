import { getTabStyle } from 'helpers/functions';

import React from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';

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
        label={<span style={getTabStyle(index === 0)}>Merits</span>}
        icon={
          <FontIcon
            style={getTabStyle(index === 0)}
            className="icon-star"
          />
        }
        onClick={() => handleChange(0)}
      />
      <BottomNavigationItem
        label={status === 'pledge' ? 
          (<span style={getTabStyle(index === 1)}>Pbros</span>) : 
          (<span style={getTabStyle(index === 1)}>Pledges</span>)
        }
        icon={
          <FontIcon
            style={getTabStyle(index === 1)}
            className="icon-users"
          />
        }
        onClick={() => handleChange(1)}
      />
      <BottomNavigationItem
        label={<span style={getTabStyle(index === 2)}>Brothers</span>}
        icon={
          <FontIcon
            style={getTabStyle(index === 2)}
            className="icon-address-book"
          />
        }
        onClick={() => handleChange(2)}
      />
      <BottomNavigationItem
        label={<span style={getTabStyle(index === 3)}>Settings</span>}
        icon={
          <FontIcon
            style={getTabStyle(index === 3)}
            className="icon-cog"
          />
        }
        onClick={() => handleChange(3)}
      />
    </BottomNavigation>
  )
}
