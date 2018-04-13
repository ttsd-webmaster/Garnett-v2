import API from "../../../../api/API.js";

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class RemoveMeritDialog extends Component {
  remove = (merit) => {
    let displayName = this.props.state.displayName;

    API.removeMerit(displayName, merit)
    .then((res) => {
      console.log('Removed merit');
      this.props.handleClose();
      this.props.handleRequestOpen(`Removed merit from ${merit.name}`);
    })
    .catch((error) => {
      console.log('Error: ', error);
      this.props.handleClose();
      this.props.handleRequestOpen('Error removing merit');
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />,
      <RaisedButton
        label="Remove"
        primary={true}
        onClick={() => this.remove(this.props.merit)}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        Remove Merit?
      </Dialog>
    )
  }
}
