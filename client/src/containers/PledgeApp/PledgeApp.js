// @flow

import './MobilePledgeApp.css';
import './PledgeApp.css';
import { isMobile, configureThemeMode } from 'helpers/functions';
import { MobileHeader, MobileNavbar } from './components/Mobile';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Main } from './components/Main/Main';
import type { User } from 'api/models';

import React, { Fragment, PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  state: User,
  logoutCallBack: () => void,
  handleRequestOpen: () => void
};

export class PledgeApp extends PureComponent<Props> {
  componentDidMount() {
    localStorage.setItem('route', 'pledge-app');
    configureThemeMode();
  }

  render() {
    const {
      history,
      state,
      logoutCallBack,
      handleRequestOpen
    } = this.props;
    return (
      <div id="pledge-app-container">
        {isMobile() ? (
          <Fragment>
            <MobileHeader history={history} state={state} />
            <MobileNavbar status={state.status} />
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
          logoutCallBack={logoutCallBack}
          handleRequestOpen={handleRequestOpen}
        />
      </div>
    )
  }
}
