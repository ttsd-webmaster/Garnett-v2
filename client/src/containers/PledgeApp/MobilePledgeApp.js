import './MobilePledgeApp.css';
import {
  loadFirebase,
  configureThemeMode
} from 'helpers/functions';
import {
  MyMerits,
  Pledges,
  Contacts,
  Settings
} from './components';
import { MobileHeader, MobileNavbar } from './components/Mobile';

import React, { PureComponent } from 'react';

export class MobilePledgeApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      totalMerits: 0,
      previousTotalMerits: 0
    };
  }

  componentDidMount() {
    console.log(`Pledge app mount: ${this.props.state.name}`)
    localStorage.setItem('route', 'pledge-app');

    configureThemeMode();

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const { displayName } = this.props.state;
        const userRef = firebase.database().ref('/users/' + displayName);

        userRef.on('value', (user) => {
          const { totalMerits } = user.val();

          localStorage.setItem('totalMerits', totalMerits);
          this.setState({
            totalMerits: totalMerits,
            previousTotalMerits: this.state.totalMerits
          });
        });
      });
    }
  }

  handleChange = (index) => {
    this.setState({ index })
  };

  render() {
    return (
      <div id="content-container">
        <MobileHeader
          status={this.props.state.status}
          index={this.state.index}
          totalMerits={this.state.totalMerits}
          previousTotalMerits={this.state.previousTotalMerits}
        />
        <MyMerits
          state={this.props.state}
          handleRequestOpen={this.props.handleRequestOpen}
          hidden={this.state.index !== 0}
        />
        <Pledges
          state={this.props.state}
          hidden={this.state.index !== 1}
        />
        <Contacts
          state={this.props.state}
          actives={this.state.activeArray}
          hidden={this.state.index !== 2}
        />
        <Settings
          state={this.props.state} 
          logoutCallBack={this.props.logoutCallBack} 
          history={this.props.history}
          hidden={this.state.index !== 3}
        />
        <MobileNavbar
          status={this.props.state.status}
          index={this.state.index}
          handleChange={this.handleChange}
        />
      </div>
    )
  }
}