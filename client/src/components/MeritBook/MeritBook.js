import ActiveMerit from './ActiveMerit/ActiveMerit';
import PledgeMerit from './PledgeMerit/PledgeMerit';

import React, {Component} from 'react';

export default class MeritBook extends Component {
  render() {
    const { status } = this.props.state;
    
    return (
      status === 'pledge' ? (
        <PledgeMerit
          state={this.props.state}
          index={this.props.index}
          merits={this.props.meritArray}
          totalMerits={this.props.totalMerits}
          pbros={this.props.pbros}
          handleRequestOpen={this.props.handleRequestOpen} 
        />
      ) : (
        <ActiveMerit 
          state={this.props.state}
          index={this.props.index}
          pledges={this.props.pledgeArray}
          handleRequestOpen={this.props.handleRequestOpen} 
        />
      )
    )
  }
}
