import './MobilePledgeApp.css';
import './PledgeApp.css';
import { androidBackOpen, androidBackClose } from 'helpers/functions.js';
import {
  LoadablePledgeMeritDialog,
  LoadableActiveMeritDialog
} from './components/Dialogs';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Main } from './components/Main/Main';

import React, { PureComponent } from 'react';

export class PledgeApp extends PureComponent {
  state = { openMerit: false }

  componentDidMount() {
    localStorage.setItem('route', 'pledge-app');
  }
  
  handleMeritOpen = () => {
    if (navigator.onLine) {
      androidBackOpen(this.handleMeritClose);
      this.setState({
        openMerit: true
      });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    androidBackClose();
    this.setState({
      openMerit: false
    });
  }

  render() {
    return (
      <div id="pledge-app-container">
        <Sidebar
          history={this.props.history}
          user={this.props.state}
          openMerit={this.handleMeritOpen}
          logOut={this.props.logoutCallBack}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <Main state={this.props.state} />
        {this.props.state.status === 'pledge' ? (
          <LoadablePledgeMeritDialog
            open={this.state.openMerit}
            state={this.props.state}
            handleMeritClose={this.handleMeritClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        ) : (
          <LoadableActiveMeritDialog
            open={this.state.openMerit}
            state={this.props.state}
            handleMeritClose={this.handleMeritClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        )}
      </div>
    )
  }
}
