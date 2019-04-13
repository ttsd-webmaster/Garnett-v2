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
      const { displayName, status } = this.props.user;
      const meritsRef = firebase.database().ref('/merits');

      meritsRef.on('value', (merits) => {
        let totalMerits = 0;
        if (merits.val()) {
          merits.forEach((merit) => {
            const { activeName, pledgeName } = merit.val();
            const meritName = status === 'pledge' ? pledgeName : activeName;
            if (displayName === meritName.replace(/ /g, '')) {
              totalMerits += merit.val().amount;
            }
          });
        }
        localStorage.setItem('totalMerits', totalMerits);
        this.setState({
          totalMerits,
          previousTotalMerits: this.state.totalMerits
        });
      });
    }
  }

  componentWillUnmount() {
    const { firebase } = window;
    const meritsRef = firebase.database().ref('/merits');
    meritsRef.off('value');
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
