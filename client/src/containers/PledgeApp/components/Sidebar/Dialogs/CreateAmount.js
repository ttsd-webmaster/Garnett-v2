// @flow

import { getDate } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import API from 'api/API.js';
import { MeritTypeOptions } from 'components';
import type { User, MeritType } from 'api/models';

import React, { Component } from 'react';

type Props = {
  users: Array<User>,
  description: string,
  handleMeritClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  type: MeritType,
  amount: string,
};

export class CreateAmount extends Component<Props, State> {
  state = {
    type: 'personal',
    amount: '0'
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
    this.setState({ amount: event.target.value });
  }

  setType = (type: MeritType) => {
    const amount = type === 'pc' ? '5' : '0';
    this.setState({ type, amount });
  }

  render() {
    return (
      <div id="merit-create-amount-container">
        <MeritTypeOptions
          type={this.state.type}
          isMobile={false}
          setType={this.setType}
        />
        <input
          id="create-merit-amount"
          type="text"
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
      </div>
    )
  }
}
