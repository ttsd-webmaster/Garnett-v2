// @flow

import API from 'api/API.js';
import type { User, Merit } from 'api/models';

import React, { PureComponent } from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

type Props = {
  state: User,
  merit: Merit,
  open: boolean,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  deleting: boolean
};

export default class DeleteMeritDialog extends PureComponent<Props, State> {
  state = { deleting: false };

  delete = (merit: Merit) => {
    const { displayName, status } = this.props.state;

    this.setState({ deleting: true });

    API.deleteMerit(displayName, status, merit)
    .then((res) => {
      let message = `Deleted merit for ${merit.pledgeName}.`;
      if (status === 'pledge') {
        message = `Deleted merit from ${merit.activeName}.`;
      }
      this.props.handleClose();
      this.props.handleRequestOpen(message);
      this.setState({ deleting: false });

      API.sendDeletedMeritNotification(merit)
      .then(res => console.log(res))
      .catch(error => console.error(`Error: ${error}`));
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      this.props.handleClose();
      this.props.handleRequestOpen('You can only delete merits you created.');
      this.setState({ deleting: false });
    });
  }

  render() {
    const spinner = (
      <CircularProgress size={25} thickness={2.5} style={{ top: '5px' }} />
    );
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        disabled={this.state.deleting}
        onClick={this.props.handleClose}
      />,
      <RaisedButton
        label={this.state.deleting ? spinner : 'Delete'}
        primary={true}
        disabled={this.state.deleting}
        onClick={() => this.delete(this.props.merit)}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        contentClassName="garnett-dialog-content"
        open={this.props.open}
        onRequestClose={this.props.handleClose}
      >
        Delete Merit?
      </Dialog>
    )
  }
}
