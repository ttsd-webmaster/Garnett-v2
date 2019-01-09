import API from 'api/API.js';
import { PledgeView } from './PledgeView/PledgeView';
import { ActiveView } from './ActiveView/ActiveView';

import React, { PureComponent } from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class PledgeInfoDialog extends PureComponent {
  state = { pledge: null }

  componentWillReceiveProps(nextProps) {
    const { pledge, state } = nextProps;
    if (pledge) {
      this.setState({ pledge });

      if (state.status !== 'pledge') {
        if (navigator.onLine) {
          const { displayName } = nextProps.state;
          const pledgeDisplayName = pledge.firstName + pledge.lastName;

          API.getRemainingMerits(displayName, pledgeDisplayName)
          .then((res) => {
            const remainingMerits = res.data;

            this.setState({ remainingMerits });
          });
        }
        else {
          this.setState({ remainingMerits: 0 });
        }
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

    if (!this.state.pledge) {
      return null
    }

    if (this.props.state.status === 'pledge') {
      return (
        <PledgeView
          open={this.props.open}
          pledge={this.state.pledge}
          handleClose={this.props.handleClose}
          actions={actions}
        />
      )
    }

    return (
      <ActiveView
        open={this.props.open}
        pledge={this.state.pledge}
        remainingMerits={this.state.remainingMerits}
        handleClose={this.props.handleClose}
        handleRequestOpen={this.props.handleRequestOpen}
        actions={actions}
      />
    )
  }
}
