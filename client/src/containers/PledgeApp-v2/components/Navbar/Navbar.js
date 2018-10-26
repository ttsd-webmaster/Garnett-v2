import './Navbar.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Navbar extends Component {
  render() {
    const {
      name,
      status,
      photoURL
    } = this.props.user;

    const {
      totalMerits,
      logOut
    } = this.props;

    return (
      <div id="navbar">
        <div id="account-info">
          <img id="navbar-photo" src={photoURL} alt="User" />
          <h3 id="account-name">{name}</h3>
          {status === 'pledge' && (
            <h4>
              Merit Count:
              <span id="total-merits">{totalMerits}</span>
              merits
            </h4>
          )}
        </div>
        <nav id="nav-items">
          <Link className="nav-item" to="/pledge-app/my-merits">
            <i className="icon-star"></i>
            My Merits
          </Link>
          <Link className="nav-item" to="/pledge-app/pledge-brothers">
            <i className="icon-users"></i>
            Pledge Brothers
          </Link>
          <Link className="nav-item" to="/pledge-app/brothers">
            <i className="icon-address-book"></i>
            Brothers
          </Link>
          <a className="nav-item" onClick={logOut}>
            <i className="icon-cog"></i>
            Log Out
          </a>
          <div id="merit-button" onClick={this.props.openMerit}>Merit</div>
        </nav>
      </div>
    )
  }
}
