import './Navbar.css'

import React, { Component } from 'react';

export class Navbar extends Component {
  render() {
    return (
      <div id="navbar">
        <img id="navbar-photo" src={this.props.user.photoURL} />
      </div>
    )
  }
}
