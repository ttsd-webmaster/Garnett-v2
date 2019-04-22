// @flow

import API from 'api/API.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import { MeritTypeOptions, StandardizedMeritOptionsDialog } from 'components';
import type { User, MeritType } from 'api/models';

import React, { Component, type Node } from 'react';

type MeritAction = 'merit' | 'demerit';

type StandardizedMeritOption = {
  reason: string,
  amount: number,
  action: MeritAction
};

type Props = {
  state: User,
  users: Array<User>,
  description: string,
  date: Date,
  setType: (MeritType) => void,
  setDescription: (string) => void,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  type: MeritType,
  amount: string,
  vibrate: boolean,
  openStandardizedOptions: boolean,
  standardizedMeritAction: ?MeritAction,
  openSpinner: boolean,
  spinnerMessage: string
};

export class CreateAmount extends Component<Props, State> {
  state = {
    type: 'personal',
    amount: '0',
    vibrate: false,
    openStandardizedOptions: false,
    standardizedMeritAction: null,
    openSpinner: false,
    spinnerMessage: ''
  };

  get meritButtons(): Node {
    const { type, standardizedMeritAction } = this.state;
    return (
      <div id="create-merit-buttons">
        <button
          className="create-merit-button demerit"
          onClick={() => this.merit('demerit')}
          disabled={
            this.buttonsDisabled ||
            (type === 'standardized' && standardizedMeritAction !== 'demerit')
          }
        >
          Demerit
        </button>
        <button
          className="create-merit-button merit"
          onClick={() => this.merit('merit')}
          disabled={
            this.buttonsDisabled ||
            (type === 'standardized' && standardizedMeritAction !== 'merit')
          }
        >
          Merit
        </button>
      </div>
    )
  }

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
    const numbersRegex = /^[0-9]+$/;
    const { value } = event.target;
    let { amount } = this.state;

    if (value && !numbersRegex.test(value)) {
      return this.vibrate();
    }

    if ((amount.length === 1 && amount !== '0') && !value) {
      amount = '0';
    } else {
      amount = value;
      // Remove leading zeroes
      amount = amount.replace(/^[0.]+/, '');
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

  setAmount = (amount: string) => this.setState({ amount });

  setType = (type: MeritType) => {
    switch (type) {
      case 'chalkboard':
      case 'personal':
        this.props.setDescription('');
        break;
      default:
    }
    this.props.setType(type);
    this.setState({ type, standardizedMeritAction: null });
  }

  selectStandardizedMeritOption = (option: StandardizedMeritOption) => {
    this.props.setDescription(option.reason);
    this.setType('standardized');
    this.handleClose();
    this.setState({
      amount: option.amount,
      standardizedMeritAction: option.action
    });
  }

  vibrate() {
    this.setState({ vibrate: true });
    setTimeout(() => {
      this.setState({ vibrate: false });
    }, 500);
  }

  merit = (action: 'merit' | 'demerit') => {
    const { state, users } = this.props;
    const { type } = this.state;
    const {
      displayName,
      name,
      photoURL,
      status
    } = state;
    let { description, date } = this.props;
    let { amount } = this.state;
    let actionText = 'Merited';

    // Convert amount from string to number
    amount = parseInt(amount, 10);

    // Convert date to timestamp so we can order merits
    date = date.getTime();

    // Amount should be negative if demerit
    if (action === 'demerit') {
      amount = -Math.abs(amount);
      actionText = 'Demerited';
    }

    // Append chalkboard text if merit type is chalkboard
    if (type === 'chalkboard') {
      description = `Chalkboard: ${description}`;
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

    const meritInfo = { user: state, selectedUsers: users, merit };

    this.openProgressDialog();

    API.createMerit(meritInfo)
    .then(res => {
      let message;
      if (status === 'pledge') {
        const totalAmount = amount * users.length;
        message = `${actionText} yourself ${totalAmount} merits`
      } else {
        message = `${actionText} pledges: ${amount} merits`
      }

      this.props.handleClose();
      this.closeProgressDialog();
      this.props.handleRequestOpen(message);

      API.sendCreatedMeritNotification(meritInfo)
      .then(res => console.log(res))
      .catch(error => console.error(`Error: ${error}`));
    })
    .catch((error) => {
      const user = error.response.data;
      let errorMessage;
      if (status === 'pledge') {
        errorMessage = `${user} does not have enough merits`
      } else {
        errorMessage = `Not enough merits for ${user}`
      }
      console.error(error);
      this.closeProgressDialog();
      this.props.handleRequestOpen(errorMessage);
    });
  }

  handleOpen = () => this.setState({ openStandardizedOptions: true });

  handleClose = () => this.setState({ openStandardizedOptions: false });

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
            setAmount={this.setAmount}
            handleOpen={this.handleOpen}
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
          { this.meritButtons }
        </div>
        <StandardizedMeritOptionsDialog
          isMobile={false}
          open={this.state.openStandardizedOptions}
          selectStandardizedMeritOption={this.selectStandardizedMeritOption}
          handleClose={this.handleClose}
        />
        <SpinnerDialog
          open={this.state.openSpinner}
          message={this.state.spinnerMessage}
        />
      </div>
    )
  }
}
