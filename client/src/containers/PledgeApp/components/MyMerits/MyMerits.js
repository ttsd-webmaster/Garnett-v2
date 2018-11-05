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
    return (
      <div
        id="merits-list"
        className={`animate-in${this.props.hidden ? " hidden" : ""}`}
      >
        {this.props.state.status !== 'pledge' && (
          <ToggleViewHeader
            allMeritsView={this.state.allMeritsView}
            setMeritsView={this.setMeritsView}
          />
        )}
        <MyMeritsList
          hidden={this.state.allMeritsView}
          state={this.props.state}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <AllMeritsList
          hidden={!this.state.allMeritsView}
          state={this.props.state}
        />
        {isMobileDevice() && (
          <Fragment>
            {this.props.state.status === 'pledge' ? (
              <LoadablePledgeMeritDialog
                open={this.props.openMerit}
                state={this.props.state}
                handleMeritClose={this.props.handleMeritClose}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            ) : (
              <LoadableActiveMeritDialog
                open={this.props.openMerit}
                state={this.props.state}
                handleMeritClose={this.props.handleMeritClose}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            )}
            <FloatingActionButton className="fixed-button" onClick={this.props.handleMeritOpen}>
              <i className="icon-pencil"></i>
            </FloatingActionButton>
          </Fragment>
        )}
      </div>
    )
  }
}
