import './MyMerits.css';
import { isMobileDevice } from 'helpers/functions.js';
import { FilterHeader } from 'components';
import { MyMeritsList, AllMeritsList, ToggleViewHeader } from './components';
import {
  LoadablePledgeMeritDialog,
  LoadableActiveMeritDialog
} from '../Dialogs';

import React, { PureComponent, Fragment } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export class MyMerits extends PureComponent {
  state = {
    allMeritsView: false,
    reverse: false
  }

  setMeritsView = (value) => {
    this.setState({ allMeritsView: value });
  }

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    const { reverse } = this.state;
    let toggleIcon = "icon-down-open-mini";

    if (reverse) {
      toggleIcon = "icon-up-open-mini";
    }

    return (
      <div className={`animate-in${this.props.hidden ? " hidden" : ""}`}>
        <ToggleViewHeader setMeritsView={this.setMeritsView} />
        <FilterHeader
          style={{ marginTop: 5 }}
          title={reverse ? "Oldest" : "Recent"}
          toggleIcon={toggleIcon}
          reverse={this.reverse}
        />
        <MyMeritsList
          hidden={this.state.allMeritsView}
          state={this.props.state}
          reverse={this.state.reverse}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <AllMeritsList
          hidden={!this.state.allMeritsView}
          state={this.props.state}
          reverse={this.state.reverse}
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
