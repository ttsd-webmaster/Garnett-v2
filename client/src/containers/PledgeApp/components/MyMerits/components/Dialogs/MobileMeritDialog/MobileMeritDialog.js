// @flow

import './MobileMeritDialog.css';
import { CreateAmount } from './CreateAmount';
import { SelectUsers } from './SelectUsers';
import type { User, MeritType } from 'api/models';

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
};

const appBarStyle = {
  backgroundColor: '#fff'
};

type Props = {
  state: User,
  open: boolean,
  handleMeritClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  view: 'createAmount' | 'selectUsers',
  type: ?MeritType,
  amount: number
};

export default class MobileMeritDialog extends PureComponent<Props, State> {
  state = {
    view: 'createAmount',
    type: null,
    amount: 0
  };

  componentWillReceiveProps(nextProps: Props) {
    // Temporary fix for Android
    if (this.props.open !== nextProps.open) {
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
    const { view, type, amount } = this.state;
    switch (view) {
      case 'createAmount':
        return <CreateAmount enterUsersView={this.enterUsersView} />;
      case 'selectUsers':
        return (
          <SelectUsers
            state={state}
            type={type}
            amount={amount}
            handleRequestOpen={this.props.handleRequestOpen}
            handleClose={this.onClose}
          />
        )
      default:
        return null
    }
  }

  enterUsersView = (type: MeritType, amount: number) => {
    this.setState({
      view: 'selectUsers',
      type,
      amount
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
      amount: 0
    });
  }

  render() {
    return (
      <FullscreenDialog
        title={this.header}
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
