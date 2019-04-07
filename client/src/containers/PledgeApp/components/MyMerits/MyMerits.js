// @flow

import './MyMerits.css';
import {
  isMobile,
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions.js';
import { MyMeritsList, AllMeritsList, ToggleViewHeader } from './components';
import { LoadableMobileMeritDialog } from './components/Dialogs';
import type { User } from 'api/models';

import React, { PureComponent, Fragment } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

type Props = {
  state: User,
  hidden: boolean,
  handleRequestOpen: () => void
};

type State = {
  view: 'myMerits' | 'allMerits',
  openMerit: boolean
};

export class MyMerits extends PureComponent<Props, State> {
  state = {
    view: 'allMerits',
    openMerit: false
  };

  get meritsList(): Node {
    const { state, handleRequestOpen } = this.props;
    const { view } = this.state;
    if (view === 'allMerits' && state.status !== 'pledge') {
      return <AllMeritsList state={state} />
    }
    return <MyMeritsList state={state} handleRequestOpen={handleRequestOpen} />
  }

  setView = (value: string) => this.setState({ view: value });

  handleMeritOpen = () => {
    if (navigator.onLine) {
      iosFullscreenDialogOpen();
      androidBackOpen(this.handleMeritClose);
      this.setState({ openMerit: true });
    } else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    androidBackClose();
    this.setState({ openMerit: false }, () => {
      iosFullscreenDialogClose();
    });
  }

  render() {
    const {
      state,
      hidden,
      handleRequestOpen
    } = this.props;

    if (hidden) {
      return null;
    }
    
    return (
      <div
        id={state.status !== 'pledge' ? "active-merits" : ""}
        className="animate-in"
      >
        {state.status !== 'pledge' && (
          <ToggleViewHeader
            view={this.state.view}
            setView={this.setView}
          />
        )}

        { this.meritsList }

        {isMobile() && (
          <Fragment>
            <LoadableMobileMeritDialog
              open={this.state.openMerit}
              state={state}
              handleMeritClose={this.handleMeritClose}
              handleRequestOpen={handleRequestOpen}
            />
            <FloatingActionButton className="fixed-button" onClick={this.handleMeritOpen}>
              <i className="icon-pencil"></i>
            </FloatingActionButton>
          </Fragment>
        )}
      </div>
    )
  }
}
