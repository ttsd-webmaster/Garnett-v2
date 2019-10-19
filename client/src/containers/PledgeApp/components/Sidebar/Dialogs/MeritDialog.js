// @flow

import './MeritDialog.css';
import { SelectUsers } from './SelectUsers';
import { CreateAmount } from './CreateAmount';
import { FullScreenDialog } from 'components/FullScreenDialog';
import type { User, MeritType } from 'api/models';

import React, { Component, type Node } from 'react';

type Props = {
  type?: MeritType,
  initialUser?: User,
  state: User,
  open: boolean,
  handleMeritClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  type: MeritType,
  users: Array<User>,
  description: string,
  date: Date
};

export default class MeritDialog extends Component<Props, State> {
  state = {
    type: this.props.type || 'personal',
    users: [],
    description: '',
    date: new Date()
  };

  get body(): Node {
    const { state, initialUser, handleRequestOpen } = this.props;
    return (
      <div id="merit-dialog-container">
        <SelectUsers
          state={state}
          type={this.state.type}
          initialUser={initialUser}
          description={this.state.description}
          setUsers={this.setUsers}
          setDescription={this.setDescription}
          setDate={this.setDate}
          handleRequestOpen={handleRequestOpen}
        />
        <CreateAmount
          state={state}
          type={this.state.type}
          users={initialUser ? [initialUser] : this.state.users}
          description={this.state.description}
          date={this.state.date}
          setType={this.setType}
          setDescription={this.setDescription}
          handleClose={this.handleClose}
          handleRequestOpen={handleRequestOpen}
        />
      </div>
    )
  }

  // Sets state from SelectUsers
  setUsers = (users: Array<User>) => this.setState({ users });
  setDescription = (description: string) => this.setState({ description});
  setDate = (date: Date) => this.setState({ date });
  // Sets state from CreateAmount
  setType = (type: MeritType) => this.setState({ type });

  handleClose = () => {
    this.props.handleMeritClose();
    this.setState({
      type: this.props.type || 'personal',
      users: [],
      description: ''
    });
  }

  render() {
    return (
      <FullScreenDialog
        open={this.props.open}
        onRequestClose={this.handleClose}
      >
        { this.body }
      </FullScreenDialog>
    )
  }
}
