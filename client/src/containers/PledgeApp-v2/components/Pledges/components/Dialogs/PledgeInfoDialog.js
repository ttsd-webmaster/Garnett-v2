import 'containers/PledgeApp/components/MeritBook/MeritBook.css';
import 'containers/PledgeApp/components/Contacts/Contacts.css';
import API from 'api/API.js';
import { PledgeView } from './PledgeView/PledgeView.js';
import { ActiveView } from './ActiveView/ActiveView.js';

import React, { PureComponent } from 'react';
import FlatButton from 'material-ui/FlatButton';

const phoneStyle = {
  display: 'block',
  textDecoration: 'none'
}

export default class PledgeInfoDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pledge: null,
      index: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pledge) {
      this.setState({
        pledge: nextProps.pledge,
        index: 0
      });

      if (nextProps.state.status !== 'pledge') {
        if (navigator.onLine) {
          const { displayName } = nextProps.state;
          const pledgeDisplayName = nextProps.pledge.firstName + nextProps.pledge.lastName;

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
            phoneStyle={phoneStyle}
            handleClose={this.props.handleClose}
            actions={actions}
          />
        ) : (
          <ActiveView
            open={this.props.open}
            pledge={this.state.pledge}
            meritsRemaining={this.state.meritsRemaining}
            index={this.state.index}
            phoneStyle={phoneStyle}
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
