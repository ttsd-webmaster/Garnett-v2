// @flow

import './MyMerits.css';
import {
  isMobile,
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions.js';
import { MyMeritsList, AllMeritsList } from './components';
import { LoadableMobileMeritDialog } from './components/Dialogs';
import { ToggleViewHeader } from 'components';
import type { User } from 'api/models';

import React, { PureComponent, Fragment } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const VIEW_OPTIONS = [
  { view: 'myMerits', label: 'My Merits' },
  { view: 'allMerits', label: 'All Merits' }
];

type Props = {
  state: User,
  scrollDirection: 'up' | 'down' | null,
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
    const { state, scrollDirection, handleRequestOpen } = this.props;
    const { view, openMerit } = this.state;
    
    return (
      <div id="my-merits" className="animate-in">
        {state.status !== 'pledge' && (
          <ToggleViewHeader
            viewOptions={VIEW_OPTIONS}
            view={view}
            setView={this.setView}
          />
        )}

        { this.meritsList }

        {isMobile() && (
          <Fragment>
            <FloatingActionButton
              className={`fixed-button ${scrollDirection === 'down' ? 'hidden' : ''}`}
              onClick={this.handleMeritOpen}
            >
              <i className="icon-pencil"></i>
            </FloatingActionButton>
            <LoadableMobileMeritDialog
              open={openMerit}
              state={state}
              handleMeritClose={this.handleMeritClose}
              handleRequestOpen={handleRequestOpen}
            />
          </Fragment>
        )}
      </div>
    )
  }
}
