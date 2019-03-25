// @flow

import API from 'api/API.js';
import type { User, Merit } from 'api/models';

import React, { PureComponent } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

type Props = {
  state: User,
  merit: Merit,
  open: boolean,
  handleDeleteClose: () => void,
  handleRequestOpen: () => void
};

export default class DeleteMeritDialog extends PureComponent<Props> {
  delete = (merit: Merit) => {
    const { displayName } = this.props.state;
    API.deleteMerit(displayName, merit)
    .then((res) => {
      this.props.handleDeleteClose();
      this.props.handleRequestOpen(`Deleted merit from ${merit.activeName}`);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      this.props.handleDeleteClose();
      this.props.handleRequestOpen('Error deleting merit');
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleDeleteClose}
      />,
      <RaisedButton
        label="Delete"
        primary={true}
        onClick={() => this.delete(this.props.merit)}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
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
