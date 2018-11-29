import './MyMerits.css';
import {
  isMobileDevice,
  androidBackOpen,
  androidBackClose,
  configureThemeMode
} from 'helpers/functions.js';
import { MyMeritsList, AllMeritsList, ToggleViewHeader } from './components';
import { LoadableMobileMeritDialog } from './components/Dialogs';

import React, { PureComponent, Fragment } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export class MyMerits extends PureComponent {
  state = {
    allMeritsView: false,
    openMerit: false
  }

  setMeritsView = (value) => {
    this.setState({ allMeritsView: value });
  }

  handleMeritOpen = () => {
    if (navigator.onLine) {
      androidBackOpen(this.handleMeritClose);
      this.setState({ openMerit: true });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    androidBackClose();
    configureThemeMode();
    this.setState({ openMerit: false });
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
            allMeritsView={this.state.allMeritsView}
            setMeritsView={this.setMeritsView}
          />
        )}
        <MyMeritsList
          hidden={this.state.allMeritsView}
          state={state}
          handleRequestOpen={handleRequestOpen}
        />
        <AllMeritsList
          hidden={!this.state.allMeritsView}
          state={state}
        />
        {isMobileDevice() && (
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
