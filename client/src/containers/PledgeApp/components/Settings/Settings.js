// @flow

import './Settings.css';
import API from 'api/API.js';
import { isMobile } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders.js';
import { UserInfo } from 'components';
import { ThemeOptions } from './components';
import type { User } from 'api/models';

import React, { Fragment, PureComponent } from 'react';
import Subheader from 'material-ui/Subheader';
import FontIcon from 'material-ui/FontIcon';

type Props = {
  history: RouterHistory,
  state: User,
  logoutCallBack: () => void
};

export class Settings extends PureComponent<Props> {
  goHome = () => {
    document.body.classList.remove('dark-mode');
    this.props.history.push('/home');
  }
  
  logout = () => {
    document.body.classList.remove('dark-mode');
    if (navigator.onLine) {
      API.logout()
      .then(res => {
        console.log(res);
        this.props.logoutCallBack();
        this.props.history.push('/');
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.logoutCallBack();
      this.props.history.push('/');
    }
  }

  viewDataApp = () => {
    this.props.history.push('/data-app', '/pledge-app/settings');
  }

  render() {
    const { state } = this.props;

    if (!state.photoURL) {
      return <LoadingComponent />
    }

    return (
      <div className="animate-in">
        <UserInfo user={state} name={state.name} />
        {isMobile() && (
          <Fragment>
            <Subheader>Miscellaneous</Subheader>
            <div id="options-container">
              {state.status !== 'pledge' && (
                <div className="option-row" onClick={this.viewDataApp}>
                  <FontIcon className="garnett-icon icon-chart-bar" />
                  View Pledging Data
                </div>
              )}
              <ThemeOptions />
              {state.status === 'pledge' ? (
                <div className="logout-button" onClick={this.logout}> Log Out </div>
              ) : (
                <div className="logout-button" onClick={this.goHome}> Back Home </div>
              )}
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}
