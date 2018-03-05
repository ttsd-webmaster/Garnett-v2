import './Chalkboards.css';
import MyChalkboards from './MyChalkboards';
import AllChalkboards from './AllChalkboards';

import React, {Component} from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

export default class Chalkboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedIndex: 0,
      chalkboardsArray: [],
      ongoingChalkboardsArray: [],
      completedChalkboardsArray: []
    };
  }

  select = (index) => {
    let previousIndex = this.state.selectedIndex;
    let myChalkboards = document.getElementById('my-chalkboards');
    let allChalkboards = document.getElementById('all-chalkboards');

    if (previousIndex !== index) {
      myChalkboards.classList.toggle('active');
      allChalkboards.classList.toggle('active');
    }

    this.setState({selectedIndex: index});
  }

  render() {
    let status = this.props.state.status;
    
    return (
      <div>
        <MyChalkboards
          state={this.props.state}
          ongoingChalkboardsArray={this.state.ongoingChalkboardsArray}
          completedChalkboardsArray={this.state.completedChalkboardsArray}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <AllChalkboards
          chalkboardsArray={this.state.chalkboardsArray}
        />

        <BottomNavigation 
          id="chalkboards-tabs" 
          className="bottom-tabs" 
          selectedIndex={this.state.selectedIndex}
        >
          <BottomNavigationItem
            label="My Chalkboards"
            icon={<div></div>}
            onClick={() => this.select(0)}
          />
          <BottomNavigationItem
            label="All Chalkboards"
            icon={<div></div>}
            onClick={() => this.select(1)}
          />
        </BottomNavigation>

        {status === 'pledge' ? (
          null
        ) : (
          <div id="add-chalkboard" className="fixed-button hidden">
            <i className="icon-calendar-plus-o"></i>
          </div>
        )}
      </div>
    )
  }
}
