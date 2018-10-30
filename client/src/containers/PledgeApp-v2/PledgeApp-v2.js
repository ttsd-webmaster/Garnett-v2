import 'containers/PledgeApp/PledgeApp.css';
import './PledgeApp-v2.css';
import { androidBackOpen, androidBackClose } from 'helpers/functions.js';
import {
  LoadablePledgeMeritDialog,
  LoadableActiveMeritDialog
} from './components/Dialogs';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Main } from './components/Main/Main';

import React, { PureComponent } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

export class PledgeApp2 extends PureComponent {
  state = { openMerit: false }

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
      <Router>
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
      </Router>
    )
  }
}
