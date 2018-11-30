import React, { PureComponent } from 'react';

const BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'];

export class MeritCreateAmount extends PureComponent {
  state = { amount: '0' }

  get buttonsDisabled() {
    const parsedAmount = parseInt(this.state.amount, 10);
    return !parsedAmount || parsedAmount % 5 !== 0;
  }

  onClick = (value) => {
    let { amount } = this.state;

    if (value === '←') {
      if (amount === '0') {
        return window.navigator.vibrate(150);
      }
      else if (amount.length === 1) {
        amount = '0';
      } else {
        amount = amount.slice(0, -1);
      }
    }
    else if (value) {
      if (amount === '0') {
        amount = value;
      } else {
        amount += value;
      }
    }

    if (this.amountValid(amount) || !parseInt(amount, 10)) {
      this.setState({ amount });
    }
    else {
      window.navigator.vibrate(150);
    }
  }

  amountValid(amount) {
    const parsedAmount = parseInt(amount, 10)
    return !!parsedAmount && parsedAmount < 1000;
  }

  nextStep = (type) => {
    const amount = type === 'demerit' ? -this.state.amount : this.state.amount;
    this.props.changeView(amount);
  }

  render() {
    return (
      <div id="merit-create-amount-container">
        <div id="merit-create-amount">{this.state.amount}</div>
        <div id="numbers-grid">
          {BUTTONS.map(number => (
            <button
              className="grid-button"
              key={number}
              onClick={() => this.onClick(number)}
            >
              {number}
            </button>
          ))}
        </div>
        <div id="merit-create-buttons">
          <button
            className="mobile-merit-button"
            onClick={() => this.nextStep('demerit')}
            disabled={this.buttonsDisabled}
          >
            Demerit
          </button>
          <button
            className="mobile-merit-button merit"
            onClick={() => this.nextStep('merit')}
            disabled={this.buttonsDisabled}
          >
            Merit
          </button>
        </div>
      </div>
    )
  }
}
