import './Sidebar.css';
import { androidBackOpen, androidBackClose } from 'helpers/functions.js';
import { AccountInfo, NavItems } from './components';

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export class Sidebar extends Component {
  state = { open: false }

  goHome = () => {
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
    const actions = [
      <FlatButton
        label="Just Kidding"
        primary={true}
        onClick={this.handleLogoutClose}
      />,
      <RaisedButton
        label="Log Out"
        primary={true}
        onClick={this.props.logOut}
      />,
    ];

    return (
      <div id="sidebar">
        <AccountInfo user={this.props.user} />
        <NavItems
          status={this.props.user.status}
          goHome={this.goHome}
          openMerit={this.props.openMerit}
          handleLogoutOpen={this.handleLogoutOpen}
        />
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