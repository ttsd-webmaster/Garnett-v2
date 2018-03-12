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
      time: 'TBD',
      location: 'TBD',
      titleValidation: true,
      descriptionValidation: true,
      dateValidation: true,
      timeValidation: true,
      locationValidation: true
    };
  }

  addChalkboard = () => {
    let displayName = this.props.state.displayName;
    let activeName = this.props.state.name;
    let photoURL = this.props.state.photoURL;
    let title = this.state.title;
    let description = this.state.description;
    let time = this.state.time;
    let location = this.state.location;
    let date = getDate(this.state.date);
    let titleValidation = true;
    let descriptionValidation = true;
    let dateValidation = true;
    let timeValidation = true;
    let locationValidation = true;

    if (!title || !description) {
      if (!title || title.length > 25) {
        titleValidation = false;
      }
      if (!description) {
        descriptionValidation = false;
      }
      if (!date) {
        dateValidation = false;
      }
      if (!time) {
        timeValidation = false;
      }
      if (!location) {
        locationValidation = false;
      }

      this.setState({
        titleValidation: titleValidation,
        descriptionValidation: descriptionValidation,
        dateValidation: dateValidation,
        timeValidation: timeValidation,
        locationValidation: locationValidation
      });
    }
    else {
      API.createChalkboard(displayName, activeName, photoURL, title, description, date, time, location)
      .then((res) => {
        console.log(res);
        this.handleClose();
        this.props.handleRequestOpen('Created a chalkboard!');

        this.setState({
          title: '',
          description: '',
          date: null,
          time: 'TBD',
          location: 'TBD'
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.handleClose();
        this.props.handleRequestOpen('Error: Choose a different title');
      });
    }
  }

  disableDates(date) {
    let today = new Date();
    return today > date;
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
      time: 'TBD',
      location: 'TBD',
      titleValidation: true,
      descriptionValidation: true,
      dateValidation: true,
      timeValidation: true,
      locationValidation: true
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
          errorText={!this.state.descriptionValidation && 'Enter a title that has less than two lines.'}
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
          firstDayOfWeek={0}
          shouldDisableDate={this.disableDates}
          onChange={(e, newValue) => this.handleChange('date', newValue)}
          errorText={!this.state.dateValidation && 'Select a date.'}
        />
        <TextField
          className="garnett-input"
          type="text"
          floatingLabelText="Time"
          multiLine={true}
          rowsMax={3}
          value={this.state.time}
          onChange={(e, newValue) => this.handleChange('time', newValue)}
          errorText={!this.state.timeValidation && 'Enter a time.'}
        />
        <TextField
          className="garnett-input"
          type="text"
          floatingLabelText="Location"
          multiLine={true}
          rowsMax={3}
          value={this.state.location}
          onChange={(e, newValue) => this.handleChange('location', newValue)}
          errorText={!this.state.locationValidation && 'Enter a location.'}
        />
      </Dialog>
    )
  }
}
