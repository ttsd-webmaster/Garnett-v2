import React from 'react';
import { Link } from 'react-router-dom';

export function NavItems(props) {
  return (
    <nav id="nav-items">
      <Link className="nav-item" to="/pledge-app/my-merits">
        <i className="icon-star"></i>
        My Merits
      </Link>
      <Link className="nav-item" to="/pledge-app/pledge-brothers">
        <i className="icon-users"></i>
        {props.status === 'pledge' ? "Pledge Brothers" : "Pledges"}
      </Link>
      <Link className="nav-item" to="/pledge-app/brothers">
        <i className="icon-address-book"></i>
        Brothers
      </Link>
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
