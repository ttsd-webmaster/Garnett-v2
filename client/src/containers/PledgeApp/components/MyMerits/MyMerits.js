import './MyMerits.css';
import { isMobileDevice } from 'helpers/functions.js';
import { MyMeritsList, AllMeritsList, ToggleViewHeader } from './components';
import {
  LoadablePledgeMeritDialog,
  LoadableActiveMeritDialog
} from '../Dialogs';

import React, { PureComponent, Fragment } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export class MyMerits extends PureComponent {
  state = { allMeritsView: false, }

  setMeritsView = (value) => {
    this.setState({ allMeritsView: value });
  }

  render() {
    const {
      state,
      hidden,
      openMerit,
      handleMeritOpen,
      handleMeritClose,
      handleRequestOpen
    } = this.props;
    
    return (
      <div
        id={state.status !== 'pledge' ? "merits-list" : ""}
        className={`animate-in${hidden ? " hidden" : ""}`}
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
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <AllMeritsList
          hidden={!this.state.allMeritsView}
          state={state}
        />
        {isMobileDevice() && (
          <Fragment>
            {state.status === 'pledge' ? (
              <LoadablePledgeMeritDialog
                open={openMerit}
                state={state}
                handleMeritClose={handleMeritClose}
                handleRequestOpen={handleRequestOpen}
              />
            ) : (
              <LoadableActiveMeritDialog
                open={openMerit}
                state={state}
                handleMeritClose={handleMeritClose}
                handleRequestOpen={handleRequestOpen}
              />
            )}
            <FloatingActionButton className="fixed-button" onClick={handleMeritOpen}>
              <i className="icon-pencil"></i>
            </FloatingActionButton>
          </Fragment>
        )}
      </div>
    )
  }
}
