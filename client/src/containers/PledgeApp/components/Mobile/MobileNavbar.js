// @flow

import React from 'react';
import { NavLink } from 'react-router-dom';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';

type Props = {
  status: string
};

export function MobileNavbar(props: Props) {
  return (
    <BottomNavigation className="bottom-tabs">
      <NavLink
        className="mobile-nav-item"
        activeClassName="active"
        to="/pledge-app/my-merits"
        exact
      >
        <BottomNavigationItem
          label="Merits"
          icon={<FontIcon className="icon-star" />}
        />
      </NavLink>
      <NavLink
        className="mobile-nav-item"
        activeClassName="active"
        to="/pledge-app/interviews"
        exact
      >
        <BottomNavigationItem
          label="Interviews"
          icon={<FontIcon className="icon-chat" />}
        />
      </NavLink>
      <NavLink
        className="mobile-nav-item"
        activeClassName="active"
        to="/pledge-app/pledges"
        exact
      >
        <BottomNavigationItem
          label={props.status === 'pledge' ? 'Pbros' : 'Pledges'}
          icon={<FontIcon className="icon-users" />}
        />
      </NavLink>
      <NavLink
        className="mobile-nav-item"
        activeClassName="active"
        to="/pledge-app/brothers"
        exact
      >
        <BottomNavigationItem
          label="Brothers"
          icon={<FontIcon className="icon-address-book" />}
        />
      </NavLink>
    </BottomNavigation>
  )
}
