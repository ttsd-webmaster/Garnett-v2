import './Sidebar.css';
import { androidBackOpen, androidBackClose } from 'helpers/functions.js';

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CountUp from 'react-countup';

export class Sidebar extends Component {
  state = {
    open: false
  }

  goHome =() => {
    this.props.history.push('/home');
  }

  handleLogoutOpen = () => {
    if (navigator.onLine) {
      androidBackOpen(this.handleLogoutClose);
      this.setState({ open: true });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleLogoutClose = () => {
    androidBackClose();
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
      previousTotalMerits,
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
      <div id="sidebar">
        <div id="account-info">
          <img id="sidebar-photo" src={photoURL} alt="User" />
          <h3 id="account-name">{name}</h3>
          <h4>
            <CountUp className="total-merits" start={previousTotalMerits} end={totalMerits} useEasing />
            merits {status !== 'pledge' && 'merited'}
          </h4>
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
          {status === 'pledge' ? (
            <a className="nav-item" onClick={this.handleLogoutOpen}>
              <i className="icon-cog"></i>
              Log Out
            </a>
          ) : (
            <a className="nav-item" onClick={this.goHome}>
              <i className="icon-logout"></i>
              Home
            </a>
          )}
          
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
