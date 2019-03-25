// @flow

import React, { Fragment, PureComponent, type Node } from 'react';
import CountUp from 'react-countup';

import type { User } from 'api/models';
import { loadFirebase } from 'helpers/functions';

type Props = {
  state: User,
  index: number
};

type State = {
  totalMerits: number,
  previousTotalMerits: number
};

export class MobileHeader extends PureComponent<Props, State> {
  state = {
    totalMerits: 0,
    previousTotalMerits: 0
  };

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const { displayName } = this.props.state;
        const userRef = firebase.database().ref('/users/' + displayName);

        userRef.on('value', (user) => {
          const { totalMerits } = user.val();

          localStorage.setItem('totalMerits', totalMerits);
          this.setState({
            totalMerits: totalMerits,
            previousTotalMerits: this.state.totalMerits
          });
        });
      });
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
