// @flow

import './MeritDialog.css';
import { getDate } from 'helpers/functions.js';
import API from 'api/API.js';
import { SelectUsers } from './SelectUsers';
import { CreateAmount } from './CreateAmount';
import type { User, MeritType } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const fullscreenDialogStyle = {
  backgroundColor: 'var(--background-color)'
};

const appBarStyle = {
  backgroundColor: 'var(--background-color)'
};

type Props = {
  state: User,
  open: boolean,
  handleMeritClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  type: MeritType,
  amount: number,
  users: Array<User>,
  description: string
};

export default class MeritDialog extends PureComponent<Props, State> {
  state = {
    users: [],
    description: ''
  };

  get body(): Node {
    const { state, handleMeritClose, handleRequestOpen } = this.props;
    return (
      <div id="merit-dialog-container">
        <SelectUsers
          state={state}
          setUsers={this.setUsers}
          setDescription={this.setDescription}
        />
        <CreateAmount
          users={this.state.users}
          description={this.state.description}
          handleMeritClose={handleMeritClose}
          handleRequestOpen={handleRequestOpen}
        />
      </div>
    )
  }

  // Left side of the modal
  setUsers = (users: Array<User>) => this.setState({ users });
  setDescription = (description: string) => this.setState({ description});

  // Right side of the modal
  setType = (type: MeritType) => this.setState({ type });
  setAmount = (value: string) => this.setState({ amount: parseInt(value, 10) });

  merit = (action: 'merit' | 'demerit') => {
    const { type, users, description } = this.state;
    let { amount } = this.state;
    const {
      displayName,
      name,
      photoURL,
      status
    } = this.props.state;
    const date = getDate();
    let actionText = 'Merited';

    if (action === 'demerit') {
      amount = -Math.abs(amount);
      actionText = 'Demerited';
    }

    const merit = {
      type,
      createdBy: displayName,
      description,
      amount,
      date
    };

    if (status === 'pledge') {
      merit.pledgeName = name;
      merit.pledgePhoto = photoURL;
    } else {
      merit.activeName = name;
      merit.activePhoto = photoURL;
    }

    const meritInfo = {
      type,
      displayName,
      merit,
      selectedUsers: users,
      status
    }

    this.openProgressDialog();

    API.createMerit(meritInfo)
    .then(res => {
      this.handleClose();
      this.closeProgressDialog();

      API.sendPledgeMeritNotification(name, users, amount)
      .then(res => {
        let message;
        if (status === 'pledge') {
          const totalAmount = amount * users.length;
          message = `${actionText} yourself ${totalAmount} merits`
        } else {
          message = `${actionText} pledges: ${amount} merits`
        }
        this.props.handleRequestOpen(message);
      })
      .catch(error => console.log(`Error: ${error}`));
    })
    .catch((error) => {
      const user = error.response.data;
      let errorMessage;
      if (status === 'pledge') {
        errorMessage = `${user} does not have enough merits`
      } else {
        errorMessage = `Not enough merits for ${user}`
      }
      console.error(error)
      this.props.handleClose();
      this.closeProgressDialog();
      this.props.handleRequestOpen(errorMessage);
    });
  }

  render() {
    return (
      <FullscreenDialog
        appBarStyle={appBarStyle}
        style={fullscreenDialogStyle}
        open={this.props.open}
        onRequestClose={this.props.handleMeritClose}
        appBarZDepth={0}
      >
        { this.body }
      </FullscreenDialog>
    )
  }
}
