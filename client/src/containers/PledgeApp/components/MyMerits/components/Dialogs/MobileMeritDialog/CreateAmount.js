// @flow

import { MeritTypeOptions } from 'components';
import type { MeritType } from 'api/models';

import React, { PureComponent } from 'react';

const BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'];

type Props = {
  enterUsersView: (string) => void
};

type State = {
  type: MeritType,
  amount: string,
  vibrate: boolean
};

export class CreateAmount extends PureComponent<Props, State> {
  state = {
    type: 'personal',
    amount: '0',
    vibrate: false
  };

  get buttonsDisabled() {
    const parsedAmount = parseInt(this.state.amount, 10);
    return !parsedAmount || parsedAmount % 5 !== 0;
  }

  onClick = (value: string) => {
    // PC merits stay constant
    if (this.state.type === 'pc') {
      return;
    }

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
      window.navigator.vibrate(150);
      this.setState({ vibrate: true });
      setTimeout(() => {
        this.setState({ vibrate: false });
      }, 500);
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

  advance = (action: 'merit' | 'demerit') => {
    const { type, amount } = this.state;
    let meritAmount = parseInt(amount, 10);
    meritAmount = action === 'merit' ? meritAmount : -meritAmount;
    this.props.enterUsersView(type, meritAmount);
  }

  render() {
    return (
      <div id="mobile-create-amount-container">
        <MeritTypeOptions
          type={this.state.type}
          isMobile
          setType={this.setType}
        />
        <div
          id="mobile-create-merit-amount"
          className={`${this.state.vibrate ? 'shake' : ''}`}
        >
          {this.state.amount}
        </div>
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
        <div id="mobile-create-merit-buttons">
          <button
            className="mobile-merit-button"
            onClick={() => this.advance('demerit')}
            disabled={this.buttonsDisabled}
          >
            Demerit
          </button>
          <button
            className="mobile-merit-button merit"
            onClick={() => this.advance('merit')}
            disabled={this.buttonsDisabled}
          >
            Merit
          </button>
        </div>
      </div>
    )
  }
}
