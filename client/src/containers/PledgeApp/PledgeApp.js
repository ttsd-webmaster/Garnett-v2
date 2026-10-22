// @flow

import './MobilePledgeApp.css';
import './PledgeApp.css';
import {
  isMobile,
  initializeFirebase,
  loadFirebase,
  configureThemeMode
} from 'helpers/functions';
import { MobileHeader, MobileNavbar } from './components/Mobile';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Main } from './components/Main/Main';
import type { User } from 'api/models';

import React, { Fragment, PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  state: User,
  logOut: () => void,
  handleRequestOpen: () => void
};

type State = {
  loaded: boolean
};

export class PledgeApp extends PureComponent<Props, State> {
  state = { loaded: false };

  componentDidMount() {
    localStorage.setItem('route', 'pledge-app');
    configureThemeMode();

    if (navigator.onLine) {
      // The app now shows before Firebase finishes loading, so make sure it's
      // initialized here too
      initializeFirebase()
      .then(() => loadFirebase('database'))
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch((error) => {
        console.error(error);
        // Merits read straight from the database, so there's nothing to show
        this.props.handleRequestOpen('Could not connect. Please reload Garnett.');
      });
    } else {
      this.setState({ loaded: true });
    }
  }

  render() {
    const {
      history,
      state,
      logOut,
      handleRequestOpen
    } = this.props;

    if (!this.state.loaded) {
      return null;
    }

    return (
      <div id="pledge-app-container">
        {isMobile() ? (
          <Fragment>
            <MobileHeader
              history={history}
              state={state}
              logOut={logOut}
            />
            <MobileNavbar status={state.status} />
          </Fragment>
        ) : (
          <Sidebar
            history={history}
            user={state}
            logOut={logOut}
            handleRequestOpen={handleRequestOpen}
          />
        )}
        <Main
          history={history}
          state={state}
          logOut={logOut}
          handleRequestOpen={handleRequestOpen}
        />
      </div>
    )
  }
}
