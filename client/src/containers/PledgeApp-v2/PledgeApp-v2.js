import 'containers/PledgeApp/PledgeApp.css';
import './PledgeApp-v2.css';
import { loadFirebase, androidBackOpen, androidBackClose } from 'helpers/functions.js';
import { LoadablePledgeMeritDialog, LoadableActiveMeritDialog } from './components/Dialogs';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Main } from './components/Main/Main';

import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

export class PledgeApp2 extends Component {
  state = {
    totalMerits: 0,
    previousTotalMerits: 0,
    openMerit: false
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const { displayName } = this.props.state;
        const userRef = firebase.database().ref('/users/' + displayName);

        userRef.on('value', (user) => {
          const { totalMerits } = user.val();

          console.log(`Total Merits: ${totalMerits}`);
          localStorage.setItem('totalMerits', totalMerits);

          this.setState({
            totalMerits: totalMerits,
            previousTotalMerits: this.state.totalMerits
          });
        });
      });
    }
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
      <Router>
        <div id="pledge-app-container">
          <Sidebar
            history={this.props.history}
            user={this.props.state}
            merits={this.state.merits}
            totalMerits={this.state.totalMerits}
            previousTotalMerits={this.state.previousTotalMerits}
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
