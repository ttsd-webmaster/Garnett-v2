// @flow

import API from 'api/API.js';
import { PledgeView } from './PledgeView/PledgeView';
import { ActiveView } from './ActiveView/ActiveView';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';
import FlatButton from 'material-ui/FlatButton';

type Props = {
  state: User,
  open: boolean,
  pledge: User,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  remainingMerits: number
};

export default class PledgeInfoDialog extends PureComponent<Props, State> {
  state = { remainingMerits: 0 };

  componentDidMount() {
    this.retrieveRemainingMerits();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.open === false && this.props.open === true) {
      this.retrieveRemainingMerits();
    }
  }

  retrieveRemainingMerits() {
    const { pledge, state } = this.props;
    if (navigator.onLine) {
      if (state.status !== 'pledge') {
        const { displayName } = this.props.state;
        const pledgeDisplayName = pledge.firstName + pledge.lastName;

        API.getRemainingMerits(displayName, pledgeDisplayName)
        .then((res) => {
          const remainingMerits = res.data;
          this.setState({ remainingMerits });
        });
      }
    }
  }

  render() {
    const actions = (
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />
    );

    if (this.props.state.status === 'pledge') {
      return (
        <PledgeView
          open={this.props.open}
          pledge={this.props.pledge}
          handleClose={this.props.handleClose}
          actions={actions}
        />
      )
    }

    return (
      <ActiveView
        open={this.props.open}
        pledge={this.props.pledge}
        remainingMerits={this.state.remainingMerits}
        handleClose={this.props.handleClose}
        handleRequestOpen={this.props.handleRequestOpen}
        actions={actions}
      />
    )
  }
}
