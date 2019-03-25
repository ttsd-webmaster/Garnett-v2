// @flow

import './Sidebar.css';
import { AccountInfo, NavItems } from './components';
import {
  LoadablePledgeMeritDialog,
  LoadableActiveMeritDialog
} from '../Dialogs';
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
    if (this.props.user.status === 'pledge') {
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
      return (
        <Fragment>
          <LoadablePledgeMeritDialog
            open={this.state.openMerit}
            state={this.props.user}
            handleMeritClose={this.handleMeritClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
          <Dialog
            actions={actions}
            modal={false}
            contentClassName="garnett-dialog-content"
            open={this.state.openLogout}
            onRequestClose={this.handleLogoutClose}
            autoScrollBodyContent={true}
          >
            Are you sure you want to log out?
          </Dialog>
        </Fragment>
      )
    }
    return (
      <LoadableActiveMeritDialog
        open={this.state.openMerit}
        state={this.props.user}
        handleMeritClose={this.handleMeritClose}
        handleRequestOpen={this.props.handleRequestOpen}
      />
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
    return (
      <div id="sidebar">
        <AccountInfo user={this.props.user} />
        <NavItems
          status={this.props.user.status}
          goHome={this.goHome}
          handleMeritOpen={this.handleMeritOpen}
          handleLogoutOpen={this.handleLogoutOpen}
        />
        { this.dialogs }
      </div>
    )
  }
}
