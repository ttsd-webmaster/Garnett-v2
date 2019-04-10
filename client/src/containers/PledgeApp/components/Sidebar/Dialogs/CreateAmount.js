// @flow

import { getDate } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import API from 'api/API.js';
import { MeritTypeOptions } from 'components/MeritTypeOptions';
import type { MeritType } from 'api/models';

import React, { Component } from 'react';

const MERIT_OPTIONS = [
  { type: 'pc', label: 'Price Center' },
  { type: 'personal', label: 'Personal' },
  { type: 'chalkboard', label: 'Chalkboard' }
];

type Props = {
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
        <div id="create-merit-amount">0</div>
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
