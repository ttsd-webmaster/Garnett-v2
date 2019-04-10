// @flow

import { getDate } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import API from 'api/API.js';
import { MeritTypeOptions } from 'components';
import type { User, MeritType } from 'api/models';

import React, { Component } from 'react';

type Props = {
  state: User,
  users: Array<User>,
  description: string,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  type: MeritType,
  amount: string,
  vibrate: boolean,
  openSpinner: boolean,
  spinnerMessage: string
};

export class CreateAmount extends Component<Props, State> {
  state = {
    type: 'personal',
    amount: '0',
    vibrate: false,
    openSpinner: false,
    spinnerMessage: ''
  };

  get buttonsDisabled(): boolean {
    const { users, description } = this.props;
    const parsedAmount = parseInt(this.state.amount, 10);
    return (
      users.length === 0 ||
      !description ||
      !parsedAmount ||
      parsedAmount % 5 !== 0
    )
  }

  changeAmount = (event: SyntheticEvent<>) => {
    // PC merits stay constant
    if (this.state.type === 'pc') {
      return this.vibrate();
    }

    const numbersRegex = /^[0-9]+$/;
    const { value } = event.target;
    let { amount } = this.state;

    if (numbersRegex.test(value) || !value) {
      if ((amount.length === 1 && amount !== '0') && !value) {
        amount = '0';
      } else {
        amount = value;
        // Remove leading zeroes
        amount = amount.replace(/^[0.]+/, '');
      }
    }

    if (this.amountValid(amount)) {
      this.setState({ amount });
    } else {
      // vibrate if amount is invalid
      this.vibrate();
    }
  }

  amountValid(amount: string): boolean {
    const parsedAmount = parseInt(amount, 10);
    return amount !== '00' && parsedAmount >= 0 && parsedAmount < 1000;
  }

  setType = (type: MeritType) => {
    const amount = type === 'pc' ? '5' : '0';
    this.setState({ type, amount });
  }

  vibrate() {
    this.setState({ vibrate: true });
    setTimeout(() => {
      this.setState({ vibrate: false });
    }, 500);
  }

  merit = (action: 'merit' | 'demerit') => {
    const { state, users, description } = this.props;
    const { type } = this.state;
    let { amount } = this.state;
    const {
      displayName,
      name,
      photoURL,
      status
    } = state;
    const date = getDate();
    let actionText = 'Merited';
    amount = parseInt(amount, 10);

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
      this.props.handleClose();
      this.closeProgressDialog();

      let message;
      if (status === 'pledge') {
        const totalAmount = amount * users.length;
        message = `${actionText} yourself ${totalAmount} merits`
      } else {
        message = `${actionText} pledges: ${amount} merits`
      }
      this.props.handleRequestOpen(message);

      API.sendPledgeMeritNotification(name, users, amount)
      .then(res => console.log(res))
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

  openProgressDialog = () => {
    const isPledge = this.props.state.status === 'pledge';
    const spinnerMessage = isPledge ? 'Meriting myself...' : 'Meriting pledges...';
    this.setState({ openSpinner: true, spinnerMessage });
  }

  closeProgressDialog = () => this.setState({ openSpinner: false });

  render() {
    return (
      <div id="merit-create-amount-container">
        <div id="merit-create-amount-content">
          <MeritTypeOptions
            type={this.state.type}
            isMobile={false}
            setType={this.setType}
          />
          <input
            id="create-merit-amount"
            className={`${this.state.vibrate ? 'shake' : ''}`}
            type="text"
            autoComplete="off"
            autoFocus
            value={this.state.amount}
            onChange={this.changeAmount}
          />
          <div id="create-merit-buttons">
            <button
              className="create-merit-button demerit"
              onClick={() => this.merit('demerit')}
              disabled={this.buttonsDisabled}
            >
              Demerit
            </button>
            <button
              className="create-merit-button merit"
              onClick={() => this.merit('merit')}
              disabled={this.buttonsDisabled}
            >
              Merit
            </button>
          </div>
          <SpinnerDialog
            open={this.state.openSpinner}
            message={this.state.spinnerMessage}
          />
        </div>
      </div>
    )
  }
}
