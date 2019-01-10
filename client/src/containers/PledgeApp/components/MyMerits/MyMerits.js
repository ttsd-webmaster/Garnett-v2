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

import React, { PureComponent, Fragment } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export class MyMerits extends PureComponent {
  state = {
    view: 'allMerits',
    openMerit: false
  }

  setView = (value) => {
    this.setState({ view: value });
  }

  handleMeritOpen = () => {
    if (navigator.onLine) {
      iosFullscreenDialogOpen();
      androidBackOpen(this.handleMeritClose);
      this.setState({ openMerit: true });
    }
    else {
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
        <MyMeritsList
          hidden={this.state.view === 'allMerits' && state.status !== 'pledge'}
          state={state}
          handleRequestOpen={handleRequestOpen}
        />
        <AllMeritsList
          hidden={this.state.view === 'myMerits'}
          state={state}
        />
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
