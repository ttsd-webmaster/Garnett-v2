import ActiveComplaints from './ActiveComplaints/ActiveComplaints';
import PledgeComplaints from './PledgeComplaints/PledgeComplaints';

import React, {Component} from 'react';

export default class Complaints extends Component {
  render() {
    const { status } = this.props.state;
    
    return (
      status === 'pledge' ? (
        <PledgeComplaints 
          state={this.props.state}
          complaints={this.props.pledgeComplaints}
        />
      ) : (
        <ActiveComplaints 
          state={this.props.state}
          index={this.props.index}
          complaints={this.props.activeComplaints}
          pendingComplaints={this.props.pendingComplaints}
          approvedComplaints={this.props.approvedComplaints}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      )
    )
  }
}
