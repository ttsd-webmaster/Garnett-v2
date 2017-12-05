import ActiveMerit from './ActiveMerit/ActiveMerit';
import PledgeMerit from './PledgeMerit/PledgeMerit';

import React, {Component} from 'react';

export default class MeritBook extends Component {
  render() {
    let isPledge = this.props.state.status;
    
    return (
      isPledge === 'pledge' ? (
        <PledgeMerit
          state={this.props.state}
          meritArray={this.props.meritArray} 
          totalMerits={this.props.state.totalMerits}
          scrollPosition={this.props.scrollPosition}
        />
      ): (
        <ActiveMerit 
          state={this.props.state} 
          pledgeArray={this.props.pledgeArray} 
          handleRequestOpen={this.props.handleRequestOpen} 
        />
      )
    )
  }
}
