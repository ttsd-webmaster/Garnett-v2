import API from 'api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class DeleteMeritDialog extends Component {
  delete = (merit) => {
    let displayName = this.props.state.displayName;

    API.deleteMerit(displayName, merit)
    .then((res) => {
      console.log('Deleted merit');
      this.props.handleDeleteClose();
      this.props.handleRequestOpen(`Deleted merit from ${merit.name}`);
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
