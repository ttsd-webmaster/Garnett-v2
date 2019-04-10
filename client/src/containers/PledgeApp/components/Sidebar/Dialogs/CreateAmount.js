// @flow

import { getDate } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import API from 'api/API.js';
import type { MeritType } from 'api/models';

import React, { Component } from 'react';
import Chip from 'material-ui/Chip';

const MERIT_OPTIONS = [
  { type: 'pc', label: 'Price Center' },
  { type: 'personal', label: 'Personal' },
  { type: 'chalkboard', label: 'Chalkboard' }
];

type State = {
  type: MeritType,
  amount: string,
};

export class CreateAmount extends Component<{}, State> {
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
        <div className="chips-container create-amount">
          {MERIT_OPTIONS.map((option) => (
            <Chip
              key={option.type}
              className={`garnett-chip merit-dialog ${option.type === this.state.type ? 'active' : ''}`}
              onClick={() => this.setType(option.type)}
            >
              { option.label }
            </Chip>
          ))}
        </div>
      </div>
    )
  }
}
