// @flow

import './MobilePledgeApp.css';
import './PledgeApp.css';
import { isMobile, configureThemeMode } from 'helpers/functions';
import { PullToRefreshSpinner } from 'helpers/loaders';
import { MobileHeader, MobileNavbar } from './components/Mobile';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Main } from './components/Main/Main';
import type { User } from 'api/models';

import React, { Fragment, PureComponent } from 'react';
import pullToRefresh from 'mobile-pull-to-refresh';
import ptrAnimatesMaterial from 'mobile-pull-to-refresh/dist/styles/material/animates';

type Props = {
  history: RouterHistory,
  state: User,
  logoutCallBack: () => void,
  handleRequestOpen: () => void
};

export class PledgeApp extends PureComponent<Props> {
  componentDidMount() {
    localStorage.setItem('route', 'pledge-app');
    if (isMobile()) {
      const pledgeAppContainer = document.getElementById('pledge-app-container');
      configureThemeMode();
      if (pledgeAppContainer) {
        pullToRefresh({
          container: pledgeAppContainer,
          animates: ptrAnimatesMaterial,
          refresh() {
            return new Promise(resolve => {
              setTimeout(() => {
                window.top.location.reload()
              }, 1000);
            })
          }
        });
      }
    }
  }

  render() {
    const { history, state, handleRequestOpen, logoutCallBack } = this.props;
    return (
      <div id="pledge-app-container">
        {isMobile() ? (
          <Fragment>
            <MobileHeader history={history} state={state} />
            <MobileNavbar status={state.status} />
            <PullToRefreshSpinner />
          </Fragment>
        ) : (
          <Sidebar
            history={history}
            user={state}
            logOut={logoutCallBack}
            handleRequestOpen={handleRequestOpen}
          />
        )}
        <Main
          history={history}
          state={state}
          handleRequestOpen={handleRequestOpen}
          logoutCallBack={logoutCallBack}
        />
      </div>
    )
  }
}
