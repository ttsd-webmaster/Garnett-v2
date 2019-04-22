// @flow

import { MeritTypeOptions } from 'components';
import { StandardizedMeritOptionsDialog } from 'components';
import type { MeritType } from 'api/models';

import React, { PureComponent } from 'react';

const BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'];

type MeritAction = 'merit' | 'demerit';

type StandardizedMeritOption = {
  reason: string,
  amount: number,
  action: MeritAction
};

type Props = {
  enterUsersView: (type: MeritType, amount: number, description: string) => void
};

type State = {
  type: MeritType,
  amount: string,
  description: '',
  vibrate: boolean,
  open: boolean,
  standardizedMeritAction: ?MeritAction
};

export class CreateAmount extends PureComponent<Props, State> {
  state = {
    type: 'personal',
    amount: '0',
    description: '',
    vibrate: false,
    open: false,
    standardizedMeritAction: null
  };

  get numbersGrid(): Node {
    return (
      <div id="numbers-grid">
        {BUTTONS.map(number => (
          <button
            className="grid-button"
            key={number}
            onClick={() => this.onClick(number)}
          >
            { number }
          </button>
        ))}
      </div>
    )
  }

  get meritButtons(): Node {
    const { type, standardizedMeritAction } = this.state;
    return (
      <div id="mobile-create-merit-buttons">
        <button
          className="mobile-merit-button"
          onClick={() => this.advance('demerit')}
          disabled={
            this.buttonsDisabled ||
            (type === 'standardized' && standardizedMeritAction !== 'demerit')
          }
        >
          Demerit
        </button>
        <button
          className="mobile-merit-button merit"
          onClick={() => this.advance('merit')}
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

  get buttonsDisabled() {
    const parsedAmount = parseInt(this.state.amount, 10);
    return !parsedAmount || parsedAmount % 5 !== 0;
  }

  onClick = (value: string) => {
    let { amount } = this.state;

    if (value === '←') {
      // Set amount to 0 if the current amount is in single digits and is not 0
      if (amount.length === 1 && amount !== '0') {
        amount = '0';
      } else {
        amount = amount.slice(0, -1);
      }
    } else if (value) {
      amount += value;
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
    this.setState({
      type,
      description: '',
      standardizedMeritAction: null
    });
  }

  selectStandardizedMeritOption = (option: StandardizedMeritOption) => {
    this.handleClose();
    this.setState({
      type: 'standardized',
      amount: option.amount,
      description: option.reason,
      standardizedMeritAction: option.action
    })
  }

  advance = (action: 'merit' | 'demerit') => {
    const { type, amount, description } = this.state;
    let meritAmount = parseInt(amount, 10);
    meritAmount = action === 'merit' ? meritAmount : -meritAmount;
    this.props.enterUsersView(type, meritAmount, description);
  }

  vibrate() {
    window.navigator.vibrate(150);
    this.setState({ vibrate: true });
    setTimeout(() => {
      this.setState({ vibrate: false });
    }, 500);
  }

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  render() {
    return (
      <div id="mobile-create-amount-container">
        <MeritTypeOptions
          type={this.state.type}
          isMobile
          setType={this.setType}
          setAmount={this.setAmount}
          handleOpen={this.handleOpen}
        />
        <div
          id="mobile-create-merit-amount"
          className={`${this.state.vibrate ? 'shake' : ''}`}
        >
          {this.state.amount}
        </div>
        { this.numbersGrid }
        { this.meritButtons }
        <StandardizedMeritOptionsDialog
          isMobile
          open={this.state.open}
          selectStandardizedMeritOption={this.selectStandardizedMeritOption}
          handleClose={this.handleClose}
        />
      </div>
    )
  }
}
