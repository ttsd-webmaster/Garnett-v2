// @flow

import './NavItems.css';

import React from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  status: string,
  goHome: () => void,
  handleLogoutOpen: () => void
};

export function NavItems(props: Props) {
  const {
    status,
    goHome,
    handleLogoutOpen
  } = props;
  const backClick = status === 'pledge' ? handleLogoutOpen : goHome;
  const backText = status === 'pledge' ? 'Log out' : 'Home';
  return (
    <nav id="nav-items">
      <NavLink
        className="nav-item"
        activeClassName="active"
        to="/pledge-app/my-merits"
        exact
      >
        <i className="icon-star" />
        My Merits
      </NavLink>
      <NavLink
        className="nav-item"
        activeClassName="active"
        to="/pledge-app/interviews"
        exact
      >
        <i className="icon-chat" />
        Interviews
      </NavLink>
      {/* <NavLink
        className="nav-item"
        activeClassName="active"
        to="/pledge-app/pledges"
        exact
      >
        <i className="icon-users" />
        {status === 'pledge' ? "Pledge Brothers" : "Pledges"}
      </NavLink> */}
      <NavLink
        className="nav-item"
        activeClassName="active"
        to="/pledge-app/brothers"
        exact
      >
        <i className="icon-address-book" />
        Brothers
      </NavLink>
      <a className="nav-item" onClick={backClick}>
        <i className="icon-logout" />
        { backText }
      </a>
    </nav>
  )
}
