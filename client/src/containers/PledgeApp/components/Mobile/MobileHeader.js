// @flow

import React, { Component, type Node } from 'react';
import CountUp from 'react-countup';

import type { User } from 'api/models';
import {
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions.js';
import { LoadableSettingsDialog } from './Dialogs';

type Props = {
  history: RouterHistory,
  state: User,
  logOut: () => void
};

type State = {
  totalMerits: number,
  previousTotalMerits: number
};

export class MobileHeader extends Component<Props, State> {
  state = {
    totalMerits: 0,
    previousTotalMerits: 0,
    openSettings: false
  };

  componentDidMount() {
    if (navigator.onLine) {
      const { firebase } = window;
      const { firstName, lastName, status } = this.props.state;
      const fullName = `${firstName} ${lastName}`;
      const meritsRef = firebase.database().ref('/merits');
      let queriedName = 'activeName';

      if (status === 'pledge') {
        queriedName = 'pledgeName';
      }

      const myMeritsRef = meritsRef.orderByChild(queriedName).equalTo(fullName);

      myMeritsRef.once('value', (merits) => {
        let totalMerits = 0;
        if (merits.val()) {
          merits.forEach((merit) => {
            totalMerits += merit.val().amount;
          });
        }

        localStorage.setItem('totalMerits', totalMerits);
        this.setState({
          totalMerits,
          previousTotalMerits: this.state.totalMerits
        });
      });

      myMeritsRef.on('child_added', (merit) => {
        let { totalMerits } = this.state;
        totalMerits += merit.val().amount;

        localStorage.setItem('totalMerits', totalMerits);
        this.setState({
          totalMerits,
          previousTotalMerits: this.state.totalMerits
        });
      });

      myMeritsRef.on('child_removed', (merit) => {
        let { totalMerits } = this.state;
        totalMerits -= merit.val().amount;

        localStorage.setItem('totalMerits', totalMerits);
        this.setState({
          totalMerits,
          previousTotalMerits: this.state.totalMerits
        });
      });
    } else {
      const totalMerits = localStorage.getItem('totalMerits');
      this.setState({ totalMerits, previousTotalMerits: 0 });
    }
  }

  componentWillUnmount() {
    const { firebase } = window;
    if (navigator.onLine && firebase) {
      const meritsRef = firebase.database().ref('/merits');
      meritsRef.off('child_added');
      meritsRef.off('child_removed');
    }
  }

  get header(): Node | string {
    const { history, state } = this.props;
    switch (history.location.pathname) {
      case '/pledge-app':
      case '/pledge-app/my-merits':
        return 'Merits';
      case '/pledge-app/pledges':
        return state.status === 'pledge' ? 'Pledge Brothers' : 'Pledges';
      case '/pledge-app/brothers':
        return 'Brothers';
      case '/pledge-app/interviews':
        return 'Interviews';
      case '/pledge-app/settings':
        return 'Settings';
      case '/pledge-app/data':
        return 'Leaderboards';
      default:
        throw new Error('unknown route');
    }
  }

  get totalMerits(): Node {
    return (
      <div id="merit-container">
        <CountUp
          className="total-merits"
          start={this.state.previousTotalMerits}
          end={this.state.totalMerits}
          useEasing
        />
        <i className="icon-star merit-icon"></i>
      </div>
    )
  }

  handleSettingsOpen = () => {
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleSettingsClose);
    this.setState({ openSettings: true });
  }

  handleSettingsClose = () => {
    androidBackClose();
    this.setState({ openSettings: false }, () => {
      iosFullscreenDialogClose();
    });
  }

  render() {
    const { history, state, logOut } = this.props;
    return (
      <div id="mobile-header">
        <div id="header-title">
          <img
            className="user-photo"
            src={state.photoURL}
            onClick={this.handleSettingsOpen}
            alt="User"
          />
          {this.header}
        </div>
        {history.location.pathname === '/pledge-app/my-merits' && (
          this.totalMerits
        )}
        <LoadableSettingsDialog
          open={this.state.openSettings}
          state={state}
          history={history}
          logOut={logOut}
          handleSettingsClose={this.handleSettingsClose}
        />
      </div>
    )
  }
}
