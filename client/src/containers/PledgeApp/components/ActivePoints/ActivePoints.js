// @flow

import './ActivePoints.css';
import { POINTS_VIEW_OPTIONS } from 'helpers/constants';
import {
  isMobile,
  isPointsAdmin,
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions';
import ToggleViewHeader from 'components/ToggleViewHeader';
import { MyPoints, PointsLeaderboard } from './components';
import { BreakdownDialog, LoadableAwardPointsDialog } from './components/Dialogs';
import type { User } from 'api/models';

import React, { Fragment, PureComponent, type Node } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

type Props = {
  state: User,
  scrollDirection: 'up' | 'down' | null,
  handleRequestOpen: (string) => void
};

type State = {
  view: 'myPoints' | 'leaderboard',
  refreshKey: number,
  breakdownActive: ?string,
  openBreakdown: boolean,
  openAward: boolean
};

export class ActivePoints extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const view = localStorage.getItem('pointsView') || 'myPoints';
    this.state = {
      view,
      refreshKey: 0,
      breakdownActive: null,
      openBreakdown: false,
      openAward: false
    };
  }

  get isAdmin(): boolean {
    return isPointsAdmin(this.props.state);
  }

  get body(): Node {
    const { state, handleRequestOpen } = this.props;
    const { view, refreshKey } = this.state;

    if (view === 'leaderboard') {
      return (
        <PointsLeaderboard
          key={`leaderboard-${refreshKey}`}
          state={state}
          isAdmin={this.isAdmin}
          openBreakdown={this.handleBreakdownOpen}
          handleRequestOpen={handleRequestOpen}
        />
      )
    }

    return (
      <MyPoints
        key={`my-points-${refreshKey}`}
        state={state}
        handleRequestOpen={handleRequestOpen}
      />
    )
  }

  setView = (view: string) => {
    localStorage.setItem('pointsView', view);
    this.setState({ view });
  }

  // Remounting the active view is the simplest way to refetch after a change
  refresh = () => {
    this.setState({ refreshKey: this.state.refreshKey + 1 });
  }

  handleBreakdownOpen = (breakdownActive: string) => {
    if (!this.isAdmin) {
      return;
    }
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleBreakdownClose);
    this.setState({ breakdownActive, openBreakdown: true });
  }

  handleBreakdownClose = () => {
    androidBackClose();
    this.setState({ openBreakdown: false, breakdownActive: null }, () => {
      iosFullscreenDialogClose();
    });
  }

  handleAwardOpen = () => {
    if (!navigator.onLine) {
      return this.props.handleRequestOpen('You are offline');
    }
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleAwardClose);
    this.setState({ openAward: true });
  }

  handleAwardClose = () => {
    androidBackClose();
    this.setState({ openAward: false }, () => {
      iosFullscreenDialogClose();
    });
  }

  render() {
    const { state, scrollDirection, handleRequestOpen } = this.props;
    const { view, breakdownActive, openBreakdown, openAward } = this.state;

    return (
      <Fragment>
        <ToggleViewHeader
          viewOptions={POINTS_VIEW_OPTIONS}
          view={view}
          setView={this.setView}
        />

        <div id="active-points" className="content animate-in">
          { this.body }

          {this.isAdmin && (
            <FloatingActionButton
              className={`fixed-button points-fab ${
                isMobile() && scrollDirection === 'down' ? 'hidden' : ''
              }`}
              onClick={this.handleAwardOpen}
            >
              <i className="icon-star"></i>
            </FloatingActionButton>
          )}
        </div>

        {this.isAdmin && (
          <Fragment>
            <BreakdownDialog
              state={state}
              activeName={breakdownActive}
              open={openBreakdown}
              handleClose={this.handleBreakdownClose}
              onChanged={this.refresh}
              handleRequestOpen={handleRequestOpen}
            />
            <LoadableAwardPointsDialog
              state={state}
              open={openAward}
              handleClose={this.handleAwardClose}
              onAwarded={this.refresh}
              handleRequestOpen={handleRequestOpen}
            />
          </Fragment>
        )}
      </Fragment>
    )
  }
}
