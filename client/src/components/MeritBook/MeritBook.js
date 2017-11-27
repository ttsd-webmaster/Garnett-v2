import ActiveMerit from './ActiveMerit/ActiveMerit';
import PledgeMerit from './PledgeMerit/PledgeMerit';

import React, {Component} from 'react';

export default class MeritBook extends Component {
  render() {
    let isActive = this.props.state.status;
    
    return (
      isActive === 'active' ? (
        <ActiveMerit 
          state={this.props.state} 
          pledgeArray={this.props.pledgeArray} 
          handleRequestOpen={this.props.handleRequestOpen} 
        />
      ): (
        <PledgeMerit 
          meritArray={this.props.meritArray} 
          totalMerits={this.props.state.totalMerits}
        />
      )
    )
  }
}