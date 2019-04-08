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

import React, { PureComponent, type Node } from 'react';

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

  get body(): ?Node {
    const { state, history, handleRequestOpen, logoutCallBack } = this.props;
    switch (this.state.index) {
      case 0:
        return <MyMerits state={state} handleRequestOpen={handleRequestOpen} />;
      case 1:
        return <Pledges state={state} handleRequestOpen={handleRequestOpen} />;
      case 2:
        return <Contacts />;
      case 3:
        return (
          <Settings
            state={state}
            logoutCallBack={logoutCallBack}
            history={history}
          />
        )
      default:
        return null
    }
  }

  handleChange = (index: number) => {
    this.setState({ index })
  };

  render() {
    return (
      <div id="content-container">
        <MobileHeader state={this.props.state} index={this.state.index} />

        { this.body }

        <MobileNavbar
          status={this.props.state.status}
          index={this.state.index}
          handleChange={this.handleChange}
        />
      </div>
    )
  }
}
