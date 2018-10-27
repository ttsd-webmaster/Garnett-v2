import './Navbar.css';

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export class Navbar extends Component {
  state = {
    open: false
  }

  handleLogoutOpen = () => {
    if (navigator.onLine) {
      this.setState({ open: true });

      // Handles android back button
      if (/android/i.test(navigator.userAgent)) {
        let path = 
          process.env.NODE_ENV === 'development' 
            ? 'http://localhost:3000'
            : 'https://garnett-app.herokuapp.com';

        window.history.pushState(null, null, path + window.location.pathname);
        window.onpopstate = () => {
          this.handleLogoutClose();
        }
      }
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleLogoutClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({ open: false });
  }

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

    const actions = [
      <FlatButton
        label="Just Kidding"
        primary={true}
        onClick={this.handleLogoutClose}
      />,
      <RaisedButton
        label="Log Out"
        primary={true}
        onClick={logOut}
      />,
    ];

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
            {status === 'pledge' ? (
              <Fragment>Pledge Brothers</Fragment>
            ) : (
              <Fragment>Pledges</Fragment>
            )}
          </Link>
          <Link className="nav-item" to="/pledge-app/brothers">
            <i className="icon-address-book"></i>
            Brothers
          </Link>
          <a className="nav-item" onClick={this.handleLogoutOpen}>
            <i className="icon-cog"></i>
            Log Out
          </a>
          <div id="merit-button" onClick={this.props.openMerit}>Merit</div>
        </nav>

        <Dialog
          actions={actions}
          modal={false}
          contentClassName="garnett-dialog-content"
          open={this.state.open}
          onRequestClose={this.handleLogoutClose}
          autoScrollBodyContent={true}
        >
          Are you sure you want to log out?
        </Dialog>
      </div>
    )
  }
}
