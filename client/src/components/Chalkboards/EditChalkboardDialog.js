import API from "../../api/API.js";

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class EditChalkboardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: '',
      newValueValidation: true
    };
  }

  edit = (newValue) => {
    if (!newValue) {
      this.setState({
        newValueValidation: false
      });
    }
    else {
      let displayName = this.props.state.displayName;
      let chalkboard = this.props.chalkboard;
      let field = this.props.field;

      API.editChalkboard(displayName, chalkboard, field, newValue)
      .then((res) => {
        console.log(`Edited ${this.props.field}`);
        this.props.handleClose();
        this.props.handleRequestOpen(`Edited ${this.props.field}`);
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.props.handleClose();
        this.props.handleRequestOpen(`Error editing ${this.props.field}`);
      });
    }
  }

  handleChange = (e, value) => {
    this.setState({
      newValue: value,
      newValueValidation: true
    });
  }

  handleClose = () => {
    this.props.handleClose();

    this.setState({
      newValue: '',
      newValueValidation: true
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Edit"
        primary={true}
        onClick={() => this.edit(this.state.newValue)}
      />,
    ];

    return (
      <Dialog
        title={`Edit ${this.props.field}`}
        titleClassName="garnett-dialog-title"
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <TextField
          className="garnett-input"
          style={{'display': 'block'}}
          type="text"
          floatingLabelText="Description"
          multiLine={true}
          rowsMax={3}
          value={this.state.newValue}
          onChange={this.handleChange}
          errorText={(!this.state.newValueValidation && 'Enter a new value')}
        />
      </Dialog>
    )
  }
}
