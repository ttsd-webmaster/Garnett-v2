import './PledgeApp-v2.css'
import { Navbar } from './components/Navbar/Navbar'

import React, { Component } from 'react';

export class PledgeApp2 extends Component {
  render() {
    return (
      <div id="pledge-app-container">
        <Navbar user={this.props.state} />
        <div />
      </div>
    )
  }
}
