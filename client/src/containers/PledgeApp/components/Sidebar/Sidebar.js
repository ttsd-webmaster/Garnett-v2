// @flow

import './Sidebar.css';
import { AccountInfo, NavItems } from './components';
import { LoadableMeritDialog } from './Dialogs';
import type { User } from 'api/models';

import React, { Component, Fragment, type Node } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

type Props = {
  history: RouterHistory,
  user: User,
  logOut: () => void,
  handleRequestOpen: () => void
};

type State = {
  openLogout: boolean,
  openMerit: boolean
};

export class Sidebar extends Component<Props, State> {
  state = {
    openLogout: false,
    openMerit: false
  };

  get dialogs(): Node {
    const { user } = this.props;
    let logOutDialog;
    if (user.status === 'pledge') {
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
        />
      ];
      logOutDialog = (
        <Dialog
          actions={actions}
          contentClassName="garnett-dialog-content"
          open={this.state.openLogout}
          onRequestClose={this.handleLogoutClose}
          autoScrollBodyContent={true}
        >
          Are you sure you want to log out?
        </Dialog>
      )
    }
    return (
      <Fragment>
        <LoadableMeritDialog
          open={this.state.openMerit}
          state={user}
          handleMeritClose={this.handleMeritClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        { logOutDialog }
      </Fragment>
    )
  }

  goHome = () => {
    this.props.history.push('/home');
  }

  handleLogoutOpen = () => {
    if (navigator.onLine) {
      this.setState({ openLogout: true });
    } else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleLogoutClose = () => {
    this.setState({ openLogout: false });
  }

  handleMeritOpen = () => {
    if (navigator.onLine) {
      this.setState({ openMerit: true });
    } else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    this.setState({ openMerit: false });
  }

  render() {
    const { user } = this.props;
    return (
      <div id="sidebar">
        <AccountInfo user={user} />
        <div className="white-background">
          <div id="merit-button" onClick={this.handleMeritOpen}>Merit</div>
        </div>
        <NavItems
          status={user.status}
          goHome={this.goHome}
          handleLogoutOpen={this.handleLogoutOpen}
        />
        { this.dialogs }
      </div>
    )
  }
}
