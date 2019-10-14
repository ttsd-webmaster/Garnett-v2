// @flow

import './Settings.css';
import API from 'api/API.js';
import { isMobile } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders.js';
import { UserInfo } from 'components';
import { ThemeOptions } from './components';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';
import Subheader from 'material-ui/Subheader';
import FontIcon from 'material-ui/FontIcon';

type Props = {
  history: RouterHistory,
  state: User,
  logOut: () => void
};

export class Settings extends PureComponent<Props> {
  goHome = () => {
    this.props.history.push('/home');
  }
  
  logOut = () => {
    if (navigator.onLine) {
      API.logOut()
      .then(res => {
        this.props.logOut();
        this.props.history.push('/');
      })
      .catch(err => console.error('err', err));
    } else {
      this.props.logOut();
      this.props.history.push('/');
    }
  }

  viewDataApp = () => {
    this.props.history.push('/data-app', '/pledge-app');
  }

  render() {
    const { state } = this.props;

    if (!state.photoURL) {
      return <LoadingComponent />
    }

    return (
      <div className="content animate-in">
        <UserInfo user={state} name={state.name} />
        <Subheader>Features</Subheader>
        <div id="options-container">
          {state.status !== 'pledge' && (
            <div className="option-row" onClick={this.viewDataApp}>
              <FontIcon className="garnett-icon icon-chart-bar" />
              View Pledging Data
            </div>
          )}
          <ThemeOptions />
          {isMobile() && (
            <div className="option-row">
              {state.status === 'pledge' ? (
                <div className="logout-button" onClick={this.logOut}>Log Out</div>
              ) : (
                <div className="logout-button" onClick={this.goHome}>Back Home</div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}
