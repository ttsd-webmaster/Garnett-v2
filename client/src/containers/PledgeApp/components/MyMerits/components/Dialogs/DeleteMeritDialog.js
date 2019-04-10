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
  handleDeleteClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  deleting: boolean
};

export default class DeleteMeritDialog extends PureComponent<Props, State> {
  state = { deleting: false };

  delete = (merit: Merit) => {
    const { displayName } = this.props.state;

    this.setState({ deleting: true });

    API.deleteMerit(displayName, merit)
    .then((res) => {
      this.props.handleDeleteClose();
      this.props.handleRequestOpen(`Deleted merit from ${merit.activeName}`);
      this.setState({ deleting: false });
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      this.props.handleDeleteClose();
      this.props.handleRequestOpen('Error deleting merit');
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
        onClick={this.props.handleDeleteClose}
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
        onRequestClose={this.props.handleDeleteClose}
        autoScrollBodyContent={true}
      >
        Delete Merit?
      </Dialog>
    )
  }
}
