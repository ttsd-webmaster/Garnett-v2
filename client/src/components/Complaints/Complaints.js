import ActiveComplaints from './ActiveComplaints/ActiveComplaints';
import PledgeComplaints from './PledgeComplaints/PledgeComplaints';

import React, {Component} from 'react';

export default class Complaints extends Component {
  render() {
    let status = this.props.state.status;
    
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
          pledges={this.props.complaintsPledgeArray}
          complaints={this.props.activeComplaints}
          pendingComplaints={this.props.pendingComplaints}
          approvedComplaints={this.props.approvedComplaints}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      )
    )
  }
}
