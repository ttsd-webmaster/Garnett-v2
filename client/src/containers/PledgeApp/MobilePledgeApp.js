// @flow

import './MobilePledgeApp.css';
import './PledgeApp.css';
import { configureThemeMode } from 'helpers/functions';
import { MobileHeader, MobileNavbar } from './components/Mobile';
import { Main } from './components/Main/Main';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  state: User,
  logoutCallBack: () => void,
  handleRequestOpen: () => void
};

export class MobilePledgeApp extends PureComponent<Props, State> {
  componentDidMount() {
    console.log(`Pledge app mount: ${this.props.state.name}`)
    localStorage.setItem('route', 'pledge-app');
    configureThemeMode();
  }

  render() {
    const { history, state } = this.props;
    return (
      <div id="content-container">
        <MobileHeader history={history} state={state} />
        <Main
          history={history}
          state={state}
          handleRequestOpen={this.props.handleRequestOpen}
          logoutCallBack={this.props.logoutCallBack}
        />
        <MobileNavbar
          status={state.status}
          handleChange={this.handleChange}
        />
      </div>
    )
  }
}
