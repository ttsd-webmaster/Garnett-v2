import '../Chalkboards.css';

import React, {Component} from 'react';

export default class PledgeChalkboards extends Component {
  render() {
    return (
      <div>
        <img className="coming-soon" src={require('../images/coming-soon.png')} />
      </div>
    )
  }
}
