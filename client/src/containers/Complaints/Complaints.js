import './Complaints.css';
import ActiveComplaints from './ActiveView/ActiveComplaints';
import PledgeComplaints from './PledgeView/PledgeComplaints';

import React, { Component } from 'react';

export default class Complaints extends Component {
  render() {
    const { status } = this.props.state;

    if (status === 'pledge') {
      return <PledgeComplaints state={this.props.state} />
    }
    
    return (
      <ActiveComplaints 
        state={this.props.state}
        index={this.props.index}
        handleRequestOpen={this.props.handleRequestOpen}
      />
    )
  }
}
