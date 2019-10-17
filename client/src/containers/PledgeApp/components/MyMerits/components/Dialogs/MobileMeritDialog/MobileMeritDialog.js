// @flow

import React, { PureComponent, type Node } from 'react';

import './MobileMeritDialog.css';
import type { User, MeritType } from 'api/models';
import { FullScreenDialog } from 'components/FullScreenDialog';
import { CreateAmount } from './CreateAmount';
import { SelectUsers } from './SelectUsers';

type Props = {
  state: User,
  open: boolean,
  handleMeritClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  view: 'createAmount' | 'selectUsers',
  type: ?MeritType,
  amount: number,
  description: string
};

export default class MobileMeritDialog extends PureComponent<Props, State> {
  state = {
    view: 'createAmount',
    type: null,
    amount: 0,
    description: ''
  };

  componentDidUpdate(prevProps: Props) {
    // Temporary fix for Android
    if (this.props.open !== prevProps.open) {
      this.resetView();
    }
  }

  get header(): string {
    const { view } = this.state;
    switch (view) {
      case 'createAmount':
        return 'Merits'
      case 'selectUsers':
        const { amount } = this.state;
        return amount > 0 ? `${amount} merits` : `${amount} demerits`;
      default:
        return ''
    }
  }

  get body(): ?Node {
    const { state } = this.props;
    const { view, type, amount, description } = this.state;
    switch (view) {
      case 'createAmount':
        return <CreateAmount enterUsersView={this.enterUsersView} />;
      case 'selectUsers':
        return (
          <SelectUsers
            state={state}
            type={type}
            amount={amount}
            description={description}
            handleClose={this.onClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        )
      default:
        return null
    }
  }

  enterUsersView = (type: MeritType, amount: number, description: string) => {
    this.setState({
      view: 'selectUsers',
      type,
      amount,
      description
    });
  }

  onClose = () => {
    this.props.handleMeritClose();
    this.resetView();
  }

  resetView = () => {
    this.setState({
      view: 'createAmount',
      type: null,
      amount: 0,
      description: ''
    });
  }

  render() {
    return (
      <FullScreenDialog
        title={this.header}
        open={this.props.open}
        onRequestClose={this.onClose}
      >
        { this.body }
      </FullScreenDialog>
    );
  }
}
