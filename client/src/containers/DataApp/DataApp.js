import './DataApp.css';
import 'containers/PledgeApp/PledgeApp.css';
import { PledgeData } from './components/PledgeData/PledgeData';
import { RushData } from './components/RushData/RushData';
import { MyData } from './components/MyData/MyData';
import { Header } from 'components/Header';

import React, { PureComponent } from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

export default class DataApp extends PureComponent {
  state = { selectedIndex: 0 }

  componentDidMount() {
    localStorage.setItem('route', 'data-app');
  }

  select = (selectedIndex) => {
    let previousIndex = this.state.selectedIndex;
    let pledgeData = document.getElementById('pledge-data');
    let rushData = document.getElementById('rush-data');
    let myData = document.getElementById('my-data');

    if (previousIndex !== selectedIndex) {
      if (pledgeData)
        pledgeData.classList.remove('active');
      if (rushData)
        rushData.classList.remove('active');
      if (myData)
        myData.classList.remove('active');

      switch (selectedIndex) {
        case 0:
          pledgeData.classList.add('active');
          break;
        case 1:
          rushData.classList.add('active');
          break;
        case 2:
          myData.classList.add('active');
          break;
        default:
      }

      this.setState({ selectedIndex });
    }
  }

  goHome = () => {
    this.props.history.push('/home');
  }

  render() {
    return (
      <div className="loading-container" id="data-app">
        <Header title="Data App" noTabs history={this.props.history} />
        <PledgeData />
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
