import ActiveComplaints from './ActiveComplaints/ActiveComplaints';
import PledgeComplaints from './PledgeComplaints/PledgeComplaints';

import React, {Component} from 'react';

export default class Complaints extends Component {
  render() {
    let isActive = this.props.state.status
    return (
      isActive === 'active' ? (
        <ActiveComplaints 
          state={this.props.state} 
          pledgeArray={this.props.pledgeArray}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      ): (
        <PledgeComplaints complaintsArray={this.props.complaintsArray} />
      )
    )
  }
}