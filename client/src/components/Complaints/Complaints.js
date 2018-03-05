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
          complaintsArray={this.props.pledgeComplaintsArray}
          scrollPosition={this.props.scrollPosition}
        />
      ) : (
        <ActiveComplaints 
          state={this.props.state}
          index={this.props.index}
          pledgeArray={this.props.complaintsPledgeArray}
          complaintsArray={this.props.activeComplaintsArray}
          pendingComplaintsArray={this.props.pendingComplaintsArray}
          approvedComplaintsArray={this.props.approvedComplaintsArray}
          scrollPosition={this.props.scrollPosition}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      )
    )
  }
}
