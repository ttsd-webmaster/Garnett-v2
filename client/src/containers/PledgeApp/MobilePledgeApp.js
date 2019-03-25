// @flow

import './MobilePledgeApp.css';
import { configureThemeMode } from 'helpers/functions';
import {
  MyMerits,
  Pledges,
  Contacts,
  Settings
} from './components';
import { MobileHeader, MobileNavbar } from './components/Mobile';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  state: User,
  logoutCallBack: () => void,
  handleRequestOpen: () => void
};

type State = {
  index: number
};

export class MobilePledgeApp extends PureComponent<Props, State> {
  state = { index: 0 };

  componentDidMount() {
    console.log(`Pledge app mount: ${this.props.state.name}`)
    localStorage.setItem('route', 'pledge-app');
    configureThemeMode();
  }

  handleChange = (index: number) => {
    this.setState({ index })
  };

  render() {
    return (
      <div id="content-container">
        <MobileHeader state={this.props.state} index={this.state.index} />
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
