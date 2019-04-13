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
      const { displayName, status } = this.props.state;
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
