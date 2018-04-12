import {commitmentOptions} from '../data.js';
import API from "../../../api/API.js";

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class MobileEditChalkboardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: undefined,
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
      let value = newValue;

      if (field === 'Date') {
        value = newValue.toLocaleDateString([], {month: '2-digit', day: '2-digit'});
      }
      else if (field === 'Time') {
        value = newValue.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }

      API.editChalkboardMobile(displayName, chalkboard, field, value)
      .then((res) => {
        console.log(`Edited ${field}`);
        this.props.updateChalkboardInfo();
        this.handleClose();
        this.props.handleRequestOpen(`Edited ${field}`);

        this.setState({
          newValue: undefined,
          newValueValidation: true
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.handleClose();
        this.props.handleRequestOpen(`Error editing ${field}`);

        this.setState({
          newValue: undefined,
          newValueValidation: true
        });
      });
    }
  }

  formatDate(date) {
    return date.toLocaleDateString([], {month: '2-digit', day: '2-digit'});
  }

  disableDates(date) {
    let today = new Date();
    return today > date;
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
      newValue: undefined,
      newValueValidation: true
    });
  }

  render() {
    let EditField;

    if (this.props.field === 'Date') {
      EditField = (
        <DatePicker
          className="garnett-input"
          floatingLabelText="Date"
          value={this.state.newValue}
          disableYearSelection
          firstDayOfWeek={0}
          formatDate={this.formatDate}
          shouldDisableDate={this.disableDates}
          onChange={this.handleChange}
          errorText={!this.state.newValueValidation && 'Select a date.'}
        />
      );
    }
    else if (this.props.field === 'Time') {
      EditField = (
        <TimePicker
          className="garnett-input"
          textFieldStyle={{'display': 'block'}}
          floatingLabelText="Time"
          value={this.state.newValue}
          minutesStep={5}
          onChange={this.handleChange}
          errorText={!this.state.newValueValidation && 'Enter a time.'}
        />
      );
    }
    else if (this.props.field === 'Amount') {
      EditField = (
        <div style={{width:'256px',margin:'20px auto 0'}}>
          <span>
            Amount: {this.state.newValue}
          </span>
          <Slider
            sliderStyle={{marginBottom:0}}
            name="Amount"
            min={0}
            max={100}
            step={5}
            value={this.state.newValue}
            onChange={this.handleChange}
          />
        </div>
      );
    }
    else if (this.props.field === 'Time Commitment') {
      EditField = (
        <SelectField
          className="garnett-input"
          value={this.state.newValue}
          floatingLabelText="Time Commitment"
          onChange={this.handleChange}
          errorText={!this.state.newValueValidation && 'Enter a time commitment.'}
        >
          {commitmentOptions.map((option, i) => (
            <MenuItem
              key={i}
              value={option}
              primaryText={option.label}
              insetChildren
              checked={option === this.state.newValue}
            />
          ))}
        </SelectField>
      );
    }
    else {
      EditField = (
        <TextField
          className="garnett-input"
          style={{'display': 'block'}}
          type="text"
          floatingLabelText={this.props.field}
          multiLine={true}
          rowsMax={3}
          value={this.state.newValue}
          onChange={this.handleChange}
          errorText={(!this.state.newValueValidation && 'Enter a new value')}
        />
      );
    }

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
        {EditField}
      </Dialog>
    )
  }
}
