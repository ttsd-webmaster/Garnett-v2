import './NavItems.css';

import React from 'react';
import { NavLink } from 'react-router-dom';

export function NavItems(props) {
  return (
    <nav id="nav-items">
      <NavLink
        className="nav-item"
        activeClassName="active"
        to="/pledge-app/my-merits"
        exact
      >
        <i className="icon-star"></i>
        My Merits
      </NavLink>
      <NavLink
        className="nav-item"
        activeClassName="active"
        to="/pledge-app/pledges"
        exact
      >
        <i className="icon-users"></i>
        {props.status === 'pledge' ? "Pledge Brothers" : "Pledges"}
      </NavLink>
      <NavLink
        className="nav-item"
        activeClassName="active"
        to="/pledge-app/brothers"
        exact
      >
        <i className="icon-address-book"></i>
        Brothers
      </NavLink>
      {props.status === 'pledge' ? (
        <a className="nav-item" onClick={props.handleLogoutOpen}>
          <i className="icon-cog"></i>
          Log Out
        </a>
      ) : (
        <a className="nav-item" onClick={props.goHome}>
          <i className="icon-logout"></i>
          Home
        </a>
      )}
      <div id="merit-button" onClick={props.openMerit}>Merit</div>
    </nav>
  )
}
