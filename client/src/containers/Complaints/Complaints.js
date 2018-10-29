import './Complaints.css';
import ActiveComplaints from './ActiveView/ActiveComplaints';
import PledgeComplaints from './PledgeView/PledgeComplaints';

import React, { Component } from 'react';

export default class Complaints extends Component {
  render() {
    const { status } = this.props.state;
    
    return (
      status === 'pledge' ? (
        <PledgeComplaints
          state={this.props.state}
        />
      ) : (
        <ActiveComplaints 
          state={this.props.state}
          index={this.props.index}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      )
    )
  }
}
