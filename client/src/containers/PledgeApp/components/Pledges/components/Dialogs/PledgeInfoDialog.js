import API from 'api/API.js';
import { PledgeView } from './PledgeView/PledgeView';
import { ActiveView } from './ActiveView/ActiveView';

import React, { PureComponent } from 'react';
import FlatButton from 'material-ui/FlatButton';

const phoneStyle = {
  display: 'block',
  textDecoration: 'none'
}

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

          API.getMeritsRemaining(displayName, pledgeDisplayName)
          .then((res) => {
            const meritsRemaining = res.data;

            this.setState({ meritsRemaining });
          });
        }
        else {
          this.setState({ meritsRemaining: 0 });
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
          phoneStyle={phoneStyle}
          handleClose={this.props.handleClose}
          actions={actions}
        />
      )
    }

    return (
      <ActiveView
        open={this.props.open}
        pledge={this.state.pledge}
        meritsRemaining={this.state.meritsRemaining}
        phoneStyle={phoneStyle}
        handleClose={this.props.handleClose}
        handleRequestOpen={this.props.handleRequestOpen}
        actions={actions}
      />
    )
  }
}
