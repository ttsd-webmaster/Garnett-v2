import ActiveComplaints from './ActiveComplaints/ActiveComplaints';
import PledgeComplaints from './PledgeComplaints/PledgeComplaints';

import React, {Component} from 'react';

export default class Complaints extends Component {
  render() {
    let isPledge = this.props.state.status
    return (
      isPledge === 'pledge' ? (
        <PledgeComplaints 
          state={this.props.state}
          complaintsArray={this.props.complaintsArray}
        />
      ): (
        <ActiveComplaints 
          state={this.props.state} 
          pledgeArray={this.props.pledgeArray}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      )
    )
  }
}