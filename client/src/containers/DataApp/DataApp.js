import './DataApp.css';
import 'containers/PledgeApp/PledgeApp.css';
import { PledgeData } from './components/PledgeData/PledgeData';
import { RushData } from './components/RushData/RushData';
import { MyData } from './components/MyData/MyData';

import React, { Component } from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

export default class DataApp extends Component {
  state = { selectedIndex: 0 }

  componentDidMount() {
    localStorage.setItem('route', 'data-app');
  }

  select = (index) => {
    let previousIndex = this.state.selectedIndex;
    let pledgeData = document.getElementById('pledge-data');
    let rushData = document.getElementById('rush-data');
    let myData = document.getElementById('my-data');

    if (previousIndex !== index) {
      if (pledgeData)
        pledgeData.classList.remove('active');
      if (rushData)
        rushData.classList.remove('active');
      if (myData)
        myData.classList.remove('active');

      if (index === 0) {
        pledgeData.classList.add('active');
      }
      else if (index === 1) {
        rushData.classList.add('active');
      }
      else {
        myData.classList.add('active');
      }

      this.setState({
        selectedIndex: index
      });
    }
  }

  goHome = () => {
    this.props.history.push('/home');
  }

  render() {
    return (
      <div className="loading-container" id="data-app">
        <div className="app-header no-tabs">
          <span> Data App </span>
          <span className="back-button" onClick={this.goHome}> Home </span>
        </div>

        <PledgeData photoMap={this.state.photoMap} />
        <RushData />
        <MyData state={this.props.state} />

        <BottomNavigation
          className="bottom-tabs"
          selectedIndex={this.state.selectedIndex}
        >
          <BottomNavigationItem
            label="Pledge Data"
            icon={<div></div>}
            onClick={() => this.select(0)}
          />
          <BottomNavigationItem
            label="Rush Data"
            icon={<div></div>}
            onClick={() => this.select(1)}
          />
          <BottomNavigationItem
            label="My Data"
            icon={<div></div>}
            onClick={() => this.select(2)}
          />
        </BottomNavigation>
      </div>
    )
  }
}
