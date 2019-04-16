// @flow

import React, { Fragment, Component, type Node } from 'react';
import CountUp from 'react-countup';

import type { User } from 'api/models';

type Props = {
  state: User,
  index: number
};

type State = {
  totalMerits: number,
  previousTotalMerits: number
};

export class MobileHeader extends Component<Props, State> {
  state = {
    totalMerits: 0,
    previousTotalMerits: 0
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

      myMeritsRef.on('value', (merits) => {
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
      meritsRef.off('value');
    }
  }

  get header(): Node | string {
    switch (this.props.index) {
      case 0:
        return (
          <Fragment>
            <CountUp
              className="total-merits"
              start={this.state.previousTotalMerits}
              end={this.state.totalMerits}
              useEasing
            />
            <span>
              merits { this.props.state.status !== 'pledge' && 'merited' }
            </span>
          </Fragment>
        )
      case 1:
        if (this.props.state.status === 'pledge') {
          return "Pledge Brothers"
        } else {
          return "Pledges"
        }
      case 2:
        return "Brothers"
      case 3:
        return "Settings"
      default:
        throw new Error('wrong index');
    }
  }

  render() {
    return (
      <div id="mobile-header">
        { this.header }
      </div>
    )
  }
}
