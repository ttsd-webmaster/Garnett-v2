import {getDate} from '../../helpers/functions.js';
import API from '../../api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class AddChalkboardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      date: null,
      titleValidation: true,
      descriptionValidation: true,
      dateValidation: true
    };
  }

  addChalkboard = () => {
    let displayName = this.props.state.displayName;
    let activeName = this.props.state.name;
    let photoURL = this.props.state.photoURL;
    let title = this.state.title;
    let description = this.state.description;
    let date = getDate(this.state.date);
    let titleValidation = true;
    let descriptionValidation = true;
    let dateValidation = true;

    if (!title || !description) {
      if (!title) {
        titleValidation = false;
      }
      if (!description) {
        descriptionValidation = false;
      }
      if (!date) {
        dateValidation = false;
      }

      this.setState({
        titleValidation: titleValidation,
        descriptionValidation: descriptionValidation,
        dateValidation: dateValidation
      });
    }
    else {
      API.createChalkboard(displayName, activeName, photoURL, title, description, date)
      .then((res) => {
        console.log(res);
        this.handleClose();
        this.props.handleRequestOpen('Created a chalkboard!');

        this.setState({
          title: '',
          description: '',
          date: null
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.handleClose();
        this.props.handleRequestOpen('Error creating chalkboard');
      });
    }
  }

  handleChange = (label, value) => {
    let validationLabel = [label] + 'Validation';

    this.setState({
      [label]: value,
      [validationLabel]: true
    });
  }

  handleClose = () => {
    this.props.handleClose();

    this.setState({
      title: '',
      description: '',
      date: null,
      titleValidation: true,
      descriptionValidation: true,
      dateValidation: true
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
        label="Submit"
        primary={true}
        onClick={this.addChalkboard}
      />,
    ];

    return (
      <Dialog
        title="Submit Chalkboard"
        titleClassName="garnett-dialog-title"
        actions={actions}
        modal={false}
        className="garnett-dialog"
        bodyClassName="garnett-dialog-body"
        contentClassName="garnett-dialog-content"
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <TextField
          className="garnett-input"
          type="text"
          floatingLabelText="Title"
          multiLine={true}
          rowsMax={3}
          value={this.state.title}
          onChange={(e, newValue) => this.handleChange('title', newValue)}
          errorText={!this.state.descriptionValidation && 'Enter a title.'}
        />
        <TextField
          className="garnett-input"
          type="text"
          floatingLabelText="Description"
          multiLine={true}
          rowsMax={3}
          value={this.state.description}
          onChange={(e, newValue) => this.handleChange('description', newValue)}
          errorText={!this.state.descriptionValidation && 'Enter a description.'}
        />
        <DatePicker
          className="garnett-input"
          style={{'marginTop': '20px'}}
          hintText="Date"
          value={this.state.date}
          disableYearSelection
          onChange={(e, newValue) => this.handleChange('date', newValue)}
          errorText={!this.state.dateValidation && 'Select a date.'}
        />
      </Dialog>
    )
  }
}
