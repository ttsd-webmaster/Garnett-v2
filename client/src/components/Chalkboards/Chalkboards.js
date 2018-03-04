import ActiveChalkboards from './ActiveChalkboards/ActiveChalkboards';
import PledgeChalkboards from './PledgeChalkboards/PledgeChalkboards';

import React, {Component} from 'react';

export default class Chalkboards extends Component {
  render() {
    let status = this.props.state.status;
    
    return (
      status === 'pledge' ? (
        <PledgeChalkboards
          state={this.props.state}
        />
      ): (
        <ActiveChalkboards
          state={this.props.state}
          index={this.props.index}
        />
      )
    )
  }
}
