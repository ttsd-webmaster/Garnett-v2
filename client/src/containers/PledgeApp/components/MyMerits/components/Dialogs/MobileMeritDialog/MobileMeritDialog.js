// @flow

import './MobileMeritDialog.css';
import { MeritCreateAmount } from './MeritCreateAmount';
import { MeritSelectPledges } from './MeritSelectPledges';
import { MeritSelectActives } from './MeritSelectActives';
import type { User } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const fullscreenDialogStyle = {
  backgroundColor: '#fff'
};

const titleStyle = {
  fontFamily: 'Helvetica Neue',
  fontSize: '18px',
  fontWeight: '500',
  color: 'rgba(0, 0, 0, 0.87)',
  marginRight: '38px',
  letterSpacing: '0.5px',
  textAlign: 'center'
}

const appBarStyle = {
  backgroundColor: '#fff'
}

type Props = {
  state: User,
  open: boolean,
  handleMeritClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  view: 'amount' | 'selectUsers',
  header: string,
  isDemerit: boolean,
  amount: number
};

export default class MobileMeritDialog extends PureComponent<Props, State> {
  state = {
    view: 'amount',
    header: 'Merits',
    isDemerit: false,
    amount: 0
  }

  componentWillReceiveProps(nextProps: Props) {
    // Temporary fix for Android
    if (this.props.open !== nextProps.open) {
      this.resetView();
    }
  }

  get body(): ?Node {
    const { state } = this.props;
    const { view, amount } = this.state;
    switch (view) {
      case 'amount':
        return <MeritCreateAmount changeView={this.changeView} />;
      case 'selectUsers':
        if (state.status === 'pledge') {
          return (
            <MeritSelectActives
              state={state}
              amount={amount}
              handleRequestOpen={this.props.handleRequestOpen}
              handleClose={this.onClose}
            />
          )
        }
        return (
          <MeritSelectPledges
            state={state}
            amount={amount}
            handleRequestOpen={this.props.handleRequestOpen}
            handleClose={this.onClose}
          />
        )
      default:
        return null
    }
  }

  changeView = (value: string) => {
    const parsedAmount = parseInt(value, 10);
    let header;

    if (parsedAmount < 0) {
      header = `${value} demerits`;
    }
    else {
      header = `${value} merits`;
    }

    this.setState({
      header,
      view: 'selectUsers',
      amount: parseInt(value, 10)
    });
  }

  onClose = () => {
    this.props.handleMeritClose();
    this.resetView();
  }

  resetView = () => {
    this.setState({
      view: 'amount',
      header: 'Merits',
      isDemerit: false,
      amount: 0
    });
  }

  render() {
    return (
      <FullscreenDialog
        title={this.state.header}
        titleStyle={titleStyle}
        appBarStyle={appBarStyle}
        style={fullscreenDialogStyle}
        open={this.props.open}
        onRequestClose={this.onClose}
        appBarZDepth={0}
      >
        { this.body }
      </FullscreenDialog>
    )
  }
}
