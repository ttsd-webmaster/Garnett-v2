import './DataApp.css';
import '../PledgeApp/PledgeApp.css';
import PledgeData from './Views/PledgeData';
import RushData from './Views/RushData';
import MyData from './Views/MyData';
import {LoadingDataApp} from '../../helpers/loaders.js';
import API from '../../api/API.js';
import pledgeData from './data/pledgeData.json';

import React, {Component} from 'react';
import {Portal} from 'react-portal';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

export default class DataApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      photoMap: [],
      loaded: false
    };
  }

  componentWillMount() {
    localStorage.setItem('route', 'data-app');

    API.getPhotos(pledgeData)
    .then((res) => {
      this.setState({
        photoMap: new Map(res.data),
        loaded: true
      });
    });
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
      this.state.loaded ? (
        <div className="loading-container" id="data-app">
          <div className="app-header no-tabs">
            <span> Data App </span>
            <span className="back-button" onClick={this.goHome}> Home </span>
          </div>

          <PledgeData photoMap={this.state.photoMap} />
          <RushData />
          <MyData state={this.props.state} />

          <Portal>
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
          </Portal>
        </div>
      ) : (
        <LoadingDataApp />
      )
    )
  }
}
