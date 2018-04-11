import ActiveMerit from './ActiveMerit/ActiveMerit';
import PledgeMerit from './PledgeMerit/PledgeMerit';

import React, {Component} from 'react';

export default class MeritBook extends Component {
  render() {
    let status = this.props.state.status;
    
    return (
      status === 'pledge' ? (
        <PledgeMerit
          state={this.props.state}
          merits={this.props.meritArray}
          activesForMerit={this.props.meritActiveArray}
          totalMerits={this.props.state.totalMerits}
          handleRequestOpen={this.props.handleRequestOpen} 
        />
      ) : (
        <ActiveMerit 
          state={this.props.state}
          index={this.props.index}
          pledges={this.props.pledgeArray}
          pledgesForMerit={this.props.meritPledgeArray}
          handleRequestOpen={this.props.handleRequestOpen} 
        />
      )
    )
  }
}
