import ActiveComplaints from './ActiveComplaints/ActiveComplaints';
import PledgeComplaints from './PledgeComplaints/PledgeComplaints';

import React, {Component} from 'react';

export default class Complaints extends Component {
  render() {
    let status = this.props.state.status
    
    if (status === 'pledge') {
      return (
        <PledgeComplaints 
          state={this.props.state}
          complaintsArray={this.props.complaintsArray}
          scrollPosition={this.props.scrollPosition}
        />
      )
    }
    else {
      return (
        <ActiveComplaints 
          state={this.props.state}
          index={this.props.index}
          pledgeArray={this.props.pledgeComplaintsArray}
          complaintsArray={this.props.activeComplaintsArray}
          scrollPosition={this.props.scrollPosition}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      )
    }
  }
}
