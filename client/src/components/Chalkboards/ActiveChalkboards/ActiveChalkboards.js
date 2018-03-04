import '../Chalkboards.css';

import React, {Component} from 'react';

export default class ActiveChalkboards extends Component {
  componentDidUpdate() {
    let addChalkboard = document.getElementById('add-chalkboard');

    if (this.props.index === 2) {
      addChalkboard.style.display = 'flex';
    }
    else {
      addChalkboard.style.display = 'none';
    }
  }
  
  render() {
    return (
      <div>
        <img className="coming-soon" src={require('../images/coming-soon.png')} />
        
        <div id="add-chalkboard" className="fixed-button hidden">
          <i className="icon-calendar-plus-o"></i>
        </div>
      </div>
    )
  }
}
