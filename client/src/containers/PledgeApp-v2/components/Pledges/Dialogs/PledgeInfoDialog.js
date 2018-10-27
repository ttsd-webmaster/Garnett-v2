import 'components/MeritBook/MeritBook.css';
import 'components/Contacts/Contacts.css';
import API from 'api/API.js';
import { PledgeView } from './PledgeView.js';
import { ActiveView } from './ActiveView.js';

import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

const activePhoneNumber = {
  display: 'block',
  textDecoration: 'none'
}

export default class PledgeInfoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledge: null,
      pledgeName: null,
      index: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pledge) {
      const pledgeName = `${nextProps.pledge.firstName} ${nextProps.pledge.lastName}`;
      const pledgeDisplayName = nextProps.pledge.firstName + nextProps.pledge.lastName;

      this.setState({
        pledge: nextProps.pledge,
        pledgeName,
        pledgeDisplayName,
        index: 0
      });

      if (nextProps.state.status !== 'pledge') {
        if (navigator.onLine) {
          const { displayName } = nextProps.state;

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

  handleChange = (value) => {
    this.setState({
      index: value
    });
  }

  render() {
    const actions = (
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />
    );

    return (
      this.state.pledge && (
        this.props.state.status === 'pledge' ? (
          <PledgeView
            open={this.props.open}
            pledge={this.state.pledge}
            activePhoneNumber={activePhoneNumber}
            handleClose={this.props.handleClose}
            actions={actions}
          />
        ) : (
          <ActiveView
            open={this.props.open}
            pledge={this.state.pledge}
            pledgeDisplayName={this.state.pledgeDisplayName}
            meritsRemaining={this.state.meritsRemaining}
            index={this.state.index}
            activePhoneNumber={activePhoneNumber}
            handleClose={this.props.handleClose}
            handleChange={this.handleChange}
            handleRequestOpen={this.props.handleRequestOpen}
            actions={actions}
          />
        )
      ) 
    )
  }
}
