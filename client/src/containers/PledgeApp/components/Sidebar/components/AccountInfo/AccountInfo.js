// @flow

import './AccountInfo.css';
import type { User } from 'api/models';

import React, { Component } from 'react';
import CountUp from 'react-countup';

type Props = {
  user: User
};

type State = {
  totalMerits: number,
  previousTotalMerits: number
};

export class AccountInfo extends Component<Props, State> {
  state = {
    totalMerits: 0,
    previousTotalMerits: 0,
  }

  componentDidMount() {
    if (navigator.onLine) {
      const { firebase } = window;
      const { displayName } = this.props.user;
      const userMeritsRef = firebase.database().ref(`/users/${displayName}/Merits`);
      const meritsRef = firebase.database().ref('/merits');

      userMeritsRef.on('value', (userMerits) => {
        meritsRef.on('value', (merits) => {
          let totalMerits = 0;
          // Retrieves the user's total merits by searching for the key in
          // the Merits table
          if (userMerits.val() && merits.val()) {
            Object.keys(userMerits.val()).forEach(function(key) {
              if (merits.val()[userMerits.val()[key]]) {
                totalMerits += merits.val()[userMerits.val()[key]].amount;
              }
            });
          }
          localStorage.setItem('totalMerits', totalMerits);
          this.setState({
            totalMerits,
            previousTotalMerits: this.state.totalMerits
          });
        });
      });
    }
  }

  componentWillUnmount() {
    const { firebase } = window;
    const { displayName } = this.props.user;
    const userRef = firebase.database().ref(`/users/${displayName}`);
    userRef.off('value');
  }

  render() {
    const {
      name,
      status,
      photoURL
    } = this.props.user;
    return (
      <div id="account-info">
        <img id="sidebar-photo" src={photoURL} alt="User" />
        <h3 id="account-name">{ name }</h3>
        <h4 id="merit-count">
          <CountUp
            className="total-merits"
            start={this.state.previousTotalMerits}
            end={this.state.totalMerits}
            useEasing
          />
          merits { status !== 'pledge' && 'merited' }
        </h4>
      </div>
    )
  }
}
