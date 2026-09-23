// @flow

import API from 'api/API.js';
import { FullScreenDialog } from 'components/FullScreenDialog';
import { OptionsDialog } from 'components/OptionsDialog';
import { PointRow } from '../PointRow';
import { EditPointsDialog } from './EditPointsDialog';
import type { User, ActivePoint } from 'api/models';

import React, { Component, type Node } from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

type Props = {
  state: User,
  activeName: ?string,
  open: boolean,
  handleClose: () => void,
  onChanged: () => void,
  handleRequestOpen: (string) => void
};

type State = {
  total: ?number,
  points: ?Array<ActivePoint>,
  selectedPoint: ?ActivePoint,
  dialogView: 'edit' | 'delete' | null,
  openOptions: boolean,
  openEdit: boolean
};

// The detailed per active breakdown. Admins only.
export class BreakdownDialog extends Component<Props, State> {
  state = {
    total: null,
    points: null,
    selectedPoint: null,
    dialogView: null,
    openOptions: false,
    openEdit: false
  };

  componentDidUpdate(prevProps: Props) {
    const { activeName, open } = this.props;
    // Fetch whenever the dialog opens for a different active
    if (open && (activeName !== prevProps.activeName || !prevProps.open)) {
      this.fetchPoints();
    }
  }

  get breakdown(): Node {
    const { points } = this.state;

    if (!points) {
      return (
        <div className="points-spinner-container">
          <CircularProgress color="var(--accent-color)" size={30} />
        </div>
      )
    }

    if (points.length === 0) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found">No points awarded yet</h1>
        </div>
      )
    }

    return (
      <List className="garnett-list">
        {points.map((point, i) => (
          point && (
            <PointRow
              key={i}
              point={point}
              handleOptionsOpen={this.handleOptionsOpen}
            />
          )
        ))}
      </List>
    )
  }

  fetchPoints = () => {
    const { state, activeName, handleRequestOpen } = this.props;

    if (!activeName) {
      return;
    }

    this.setState({ points: null, total: null });

    API.getActivePoints(state.displayName, activeName)
    .then((res) => {
      const { total, points } = res.data;
      this.setState({ total, points });
    })
    .catch((error) => {
      console.error(error);
      handleRequestOpen('Could not load that active’s points.');
    });
  }

  handleOptionsOpen = (selectedPoint: ActivePoint) => {
    if (!navigator.onLine) {
      return this.props.handleRequestOpen('You are offline');
    }
    this.setState({ selectedPoint, openOptions: true });
  }

  handleOptionsClose = () => {
    this.setState({ selectedPoint: null, openOptions: false });
  }

  handleEditOpen = (dialogView: 'edit' | 'delete') => {
    this.setState({ dialogView, openOptions: false, openEdit: true });
  }

  handleEditClose = () => {
    this.setState({ selectedPoint: null, dialogView: null, openEdit: false });
  }

  // Refresh this breakdown and let the parent refresh the leaderboard
  onChanged = () => {
    this.handleEditClose();
    this.fetchPoints();
    this.props.onChanged();
  }

  render() {
    const { state, activeName, open, handleClose, handleRequestOpen } = this.props;
    const {
      total,
      selectedPoint,
      dialogView,
      openOptions,
      openEdit
    } = this.state;

    const DIALOG_OPTIONS = [
      {
        header: 'Point Options',
        choices: [
          {
            text: 'Correct Points',
            icon: 'icon-pencil',
            onClick: () => this.handleEditOpen('edit')
          },
          {
            text: 'Take Back Points',
            icon: 'icon-trash-empty',
            onClick: () => this.handleEditOpen('delete')
          }
        ]
      }
    ];

    return (
      <FullScreenDialog
        title={activeName || ''}
        open={open}
        onRequestClose={handleClose}
      >
        {total !== null && total !== undefined && (
          <div id="points-breakdown-total">
            <span className="points-breakdown-amount">{ total }</span>
            <span className="points-breakdown-label">total points</span>
          </div>
        )}

        { this.breakdown }

        <OptionsDialog
          open={openOptions}
          options={DIALOG_OPTIONS}
          handleClose={this.handleOptionsClose}
        />
        <EditPointsDialog
          state={state}
          point={selectedPoint}
          view={dialogView}
          open={openEdit}
          handleClose={this.handleEditClose}
          onChanged={this.onChanged}
          handleRequestOpen={handleRequestOpen}
        />
      </FullScreenDialog>
    );
  }
}
