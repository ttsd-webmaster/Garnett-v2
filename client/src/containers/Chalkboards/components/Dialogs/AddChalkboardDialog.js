import { commitmentOptions } from './data.js';
import API from 'api/API.js';
import { isMobile, invalidSafariVersion } from 'helpers/functions.js';

import React, { Component } from 'react';
import FullscreenDialog from 'material-ui-fullscreen-dialog';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const defaultTime = new Date();
defaultTime.setHours(12, 0, 0, 0);

const mobileAddChalkboardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingBottom: '50px'
};

export default class AddChalkboardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      date: null,
      time: defaultTime,
      location: 'TBD',
      timeCommitment: null,
      amount: 0,
      titleValidation: true,
      descriptionValidation: true,
      dateValidation: true,
      timeValidation: true,
      locationValidation: true,
      timeCommitmentValidation: true
    };
  }

  addChalkboard = () => {
    const {
      title, 
      description,
      date,
      time,
      location,
      timeCommitment,
      amount
    } = this.state;
    let titleValidation = true;
    let descriptionValidation = true;
    let dateValidation = true;
    let timeValidation = true;
    let locationValidation = true;
    let timeCommitmentValidation = true;

    if (invalidSafariVersion()) {
      this.handleClose();
      this.props.handleRequestOpen('Please update to Safari version 10 or above');
    }
    else {
      if (!title || title.length > 40 || !description || !date || !time || !location || !timeCommitment || amount === 0) {
        if (!title || title.length > 40) {
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
        if (!timeCommitment) {
          timeCommitmentValidation = false;
        }

        this.setState({
          titleValidation,
          descriptionValidation,
          dateValidation,
          timeValidation,
          locationValidation,
          timeCommitmentValidation
        });
      }
      else {
        const {
          displayName,
          name,
          photoURL
        } = this.props.state;
        const parsedDate = this.formatDate(date);
        const parsedTime = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const chalkboard = {
          displayName,
          activeName: name,
          photoURL,
          title,
          description,
          date: parsedDate,
          time: parsedTime,
          location,
          timeCommitment,
          amount
        };

        API.createChalkboard(chalkboard)
        .then((res) => {
          console.log(res);
          this.handleClose();

          API.sendCreatedChalkboardNotification(title)
          .then(res => {
            this.props.handleRequestOpen(`Created chalkboard, ${title}`);
          })
          .catch(error => console.log(`Error: ${error}`));
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
          this.handleClose();
          this.props.handleRequestOpen('Error: Chalkboard title is already taken');
        });
      }
    }
  }

  formatDate(date) {
    return date.toLocaleDateString([], {month: '2-digit', day: '2-digit'});
  }

  disableDates(date) {
    const today = new Date();
    return date < today;
  }

  handleChange = (label, value) => {
    const validationLabel = [label] + 'Validation';

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
      time: defaultTime,
      location: 'TBD',
      timeCommitment: null,
      amount: 0,
      titleValidation: true,
      descriptionValidation: true,
      dateValidation: true,
      timeValidation: true,
      locationValidation: true,
      timeCommitmentValidation: true
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

    const mobileAction = (
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.addChalkboard}
      />
    )

    if (isMobile()) {
      return (
        <FullscreenDialog
          title="New Chalkboard"
          titleStyle={{fontSize:'22px'}}
          containerStyle={mobileAddChalkboardStyle}
          actionButton={mobileAction}
          open={this.props.open}
          onRequestClose={this.handleClose}
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
            floatingLabelText="Date"
            value={this.state.date}
            disableYearSelection
            firstDayOfWeek={0}
            formatDate={this.formatDate}
            shouldDisableDate={this.disableDates}
            onChange={(e, newValue) => this.handleChange('date', newValue)}
            errorText={!this.state.dateValidation && 'Select a date.'}
          />
          <TimePicker
            className="garnett-input"
            textFieldStyle={{display:'block'}}
            floatingLabelText="Time"
            value={this.state.time}
            defaultTime={defaultTime}
            minutesStep={5}
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
          <SelectField
            className="garnett-input"
            value={this.state.timeCommitment}
            floatingLabelText="Time Commitment"
            onChange={(e, key, newValue) => this.handleChange('timeCommitment', newValue)}
            errorText={!this.state.timeCommitmentValidation && 'Enter a time commitment.'}
          >
            {commitmentOptions.map((option, i) => (
              <MenuItem
                key={i}
                value={option}
                primaryText={option.label}
                insetChildren
                checked={option === this.state.timeCommitment}
              />
            ))}
          </SelectField>
          <div style={{width:'256px',margin:'20px auto 0'}}>
            <span>
              Amount: {this.state.amount} merits
            </span>
            <Slider
              sliderStyle={{marginBottom:0}}
              name="Amount"
              min={0}
              max={100}
              step={5}
              value={this.state.amount}
              onChange={(e, newValue) => this.handleChange('amount', newValue)}
            />
          </div>
        </FullscreenDialog>
      )
    }

    return (
      <Dialog
        title="New Chalkboard"
        titleClassName="garnett-dialog-title"
        actions={actions}
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
          textFieldStyle={{display:'block',margin:'0 auto'}}
          floatingLabelText="Date"
          value={this.state.date}
          disableYearSelection
          firstDayOfWeek={0}
          formatDate={this.formatDate}
          shouldDisableDate={this.disableDates}
          onChange={(e, newValue) => this.handleChange('date', newValue)}
          errorText={!this.state.dateValidation && 'Select a date.'}
        />
        <TimePicker
          className="garnett-input"
          textFieldStyle={{display:'block'}}
          floatingLabelText="Time"
          value={this.state.time}
          defaultTime={defaultTime}
          minutesStep={5}
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
        <SelectField
          className="garnett-input"
          value={this.state.timeCommitment}
          floatingLabelText="Time Commitment"
          onChange={(e, key, newValue) => this.handleChange('timeCommitment', newValue)}
          errorText={!this.state.timeCommitmentValidation && 'Enter a time commitment.'}
        >
          {commitmentOptions.map((option, i) => (
            <MenuItem
              key={i}
              value={option}
              primaryText={option.label}
              insetChildren
              checked={option === this.state.timeCommitment}
            />
          ))}
        </SelectField>
        <div style={{width:'256px',margin:'20px auto 0'}}>
          <span>
            Amount: {this.state.amount} merits
          </span>
          <Slider
            sliderStyle={{marginBottom:0}}
            name="Amount"
            min={0}
            max={100}
            step={5}
            value={this.state.amount}
            onChange={(e, newValue) => this.handleChange('amount', newValue)}
          />
        </div>
      </Dialog>
    )
  }
}
