// @flow

import API from 'api/API.js';
import { formatDate } from 'helpers/functions';
import { SpinnerDialog } from 'helpers/loaders';
import { FullScreenDialog } from 'components/FullScreenDialog';
import { SelectedUsersChips } from 'components';
import type { User } from 'api/models';

import React, { Component, type Node } from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';

type Props = {
  state: User,
  open: boolean,
  handleClose: () => void,
  onAwarded: () => void,
  handleRequestOpen: (string) => void
};

type PointAction = 'award' | 'demerit';

type State = {
  actives: ?Array<User>,
  selectedUsers: Array<User>,
  name: string,
  title: string,
  amount: string,
  openSpinner: boolean
};

export default class AwardPointsDialog extends Component<Props, State> {
  state = {
    actives: null,
    selectedUsers: [],
    name: '',
    title: '',
    amount: '',
    openSpinner: false
  };

  componentDidMount() {
    this.fetchActives();
  }

  get remainingActives(): Array<User> {
    const { actives, selectedUsers, name } = this.state;

    if (!actives) {
      return [];
    }

    return actives.filter((active) => {
      const isSelected = selectedUsers.some((selectedUser) => (
        selectedUser.displayName === active.displayName
      ));

      if (isSelected) {
        return false;
      }

      if (!name) {
        return true;
      }

      const activeName = `${active.firstName} ${active.lastName}`.toLowerCase();
      return activeName.startsWith(name.trim().toLowerCase());
    });
  }

  get buttonDisabled(): boolean {
    const { selectedUsers, title, amount } = this.state;
    const parsedAmount = Number(amount);
    return (
      selectedUsers.length === 0 ||
      !title.trim() ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    );
  }

  get activesList(): Node {
    const { actives } = this.state;

    if (!actives) {
      return (
        <div className="points-spinner-container">
          <CircularProgress color="var(--accent-color)" size={30} />
        </div>
      )
    }

    return (
      <List className="garnett-list">
        {this.remainingActives.map((active) => (
          <div key={active.displayName}>
            <Divider className="garnett-divider large" inset={true} />
            <ListItem
              className="garnett-list-item large"
              leftAvatar={
                <Avatar
                  className="garnett-image large"
                  size={70}
                  src={active.photoURL}
                />
              }
              primaryText={
                <p className="garnett-name">
                  { active.firstName } { active.lastName }
                </p>
              }
              secondaryText={
                <p className="garnett-description">
                  { active.year }
                  <br />
                  { active.major }
                </p>
              }
              secondaryTextLines={2}
              onClick={() => this.selectUser(active)}
            >
              <p className="points-total-badge">{ active.totalPoints }</p>
            </ListItem>
            <Divider className="garnett-divider large" inset={true} />
          </div>
        ))}
      </List>
    )
  }

  fetchActives = () => {
    const { displayName } = this.props.state;

    API.getActivesForPoints(displayName)
    .then((res) => {
      this.setState({ actives: res.data });
    })
    .catch((error) => {
      console.error(error);
      this.props.handleRequestOpen('Could not load actives.');
    });
  }

  setName = (event: SyntheticEvent<>) => {
    this.setState({ name: event.target.value });
  }

  setTitle = (event: SyntheticEvent<>) => {
    this.setState({ title: event.target.value });
  }

  setAmount = (event: SyntheticEvent<>) => {
    this.setState({ amount: event.target.value });
  }

  selectUser = (user: User) => {
    const { selectedUsers } = this.state;
    this.setState({
      selectedUsers: selectedUsers.concat([user]),
      name: ''
    });
  }

  deselectUser = (user: User) => {
    const selectedUsers = this.state.selectedUsers.filter((currentUser) => (
      currentUser.displayName !== user.displayName
    ));
    this.setState({ selectedUsers });
  }

  selectAllActives = () => {
    const { actives } = this.state;
    if (actives) {
      this.setState({ selectedUsers: actives, name: '' });
    }
  }

  // Points are entered as a positive number, and demerits are saved as
  // negative, the same way pledge merits work
  awardPoints = (action: PointAction) => {
    const { state, handleRequestOpen } = this.props;
    const { selectedUsers, title } = this.state;
    const isDemerit = action === 'demerit';
    const amount = Math.abs(Number(this.state.amount));

    if (!navigator.onLine) {
      return handleRequestOpen('You are offline');
    }

    this.setState({ openSpinner: true });

    API.createPoints({
      user: state,
      selectedUsers,
      point: {
        title: title.trim(),
        amount: isDemerit ? -amount : amount,
        date: new Date().toISOString()
      }
    })
    .then(() => {
      const count = selectedUsers.length;
      this.setState({ openSpinner: false });
      const actives = `${count} ${count === 1 ? 'active' : 'actives'}`;
      handleRequestOpen(isDemerit
        ? `Demerited ${amount} points from ${actives}.`
        : `Awarded ${amount} points to ${actives}.`
      );
      this.reset();
      this.props.onAwarded();
      this.props.handleClose();
    })
    .catch((error) => {
      console.error(error);
      this.setState({ openSpinner: false });
      const message = (error.response && error.response.data) ||
        'Could not award points.';
      handleRequestOpen(message);
    });
  }

  reset = () => {
    this.setState({
      selectedUsers: [],
      name: '',
      title: '',
      amount: ''
    });
  }

  onClose = () => {
    this.reset();
    this.props.handleClose();
  }

  render() {
    const { open } = this.props;
    const { selectedUsers, name, title, amount, openSpinner } = this.state;

    return (
      <FullScreenDialog
        title="Award Points"
        open={open}
        onRequestClose={this.onClose}
      >
        <div id="points-inputs-container">
          <input
            className="points-input"
            type="text"
            placeholder="Title (e.g. Study hours with a pledge)"
            autoComplete="off"
            value={title}
            onChange={this.setTitle}
          />
          <input
            className="points-input"
            type="number"
            min="1"
            placeholder="Points"
            autoComplete="off"
            value={amount}
            onChange={this.setAmount}
          />
          <SelectedUsersChips
            selectedUsers={selectedUsers}
            deselectUser={this.deselectUser}
          />
          <div id="points-name-container">
            <input
              className="points-input name"
              type="text"
              placeholder="Name"
              autoComplete="off"
              value={name}
              onChange={this.setName}
            />
            {!name && selectedUsers.length === 0 && (
              <span id="points-select-all" onClick={this.selectAllActives}>
                Select all actives
              </span>
            )}
          </div>
          <p className="points-date-label">{ formatDate(new Date()) }</p>
        </div>

        <Subheader className="garnett-subheader">Actives</Subheader>
        { this.activesList }

        <div id="points-confirm-container">
          <button
            className="points-button demerit"
            onClick={() => this.awardPoints('demerit')}
            disabled={this.buttonDisabled}
          >
            Demerit
          </button>
          <button
            className="points-button"
            onClick={() => this.awardPoints('award')}
            disabled={this.buttonDisabled}
          >
            Award Points
          </button>
        </div>

        <SpinnerDialog open={openSpinner} message="Saving points" />
      </FullScreenDialog>
    );
  }
}
