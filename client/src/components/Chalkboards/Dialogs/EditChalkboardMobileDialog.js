import {commitmentOptions} from '../data.js';
import API from '../../../api/API.js';
import {invalidSafariVersion} from '../../../helpers/functions.js';

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
    let field = this.props.field;

    if (field === 'Date' && invalidSafariVersion()) {
      this.handleClose();
      this.props.handleRequestOpen('Please update to Safari version 10 or above.');
    }
    else {
      if (!newValue) {
        this.setState({
          newValueValidation: false
        });
      }
      else {
        let displayName = this.props.state.displayName;
        let chalkboard = this.props.chalkboard;
        let value = newValue;

        if (field === 'Date') {
          value = this.formatDate(newValue);
        }
        else if (field === 'Time') {
          value = newValue.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        API.editChalkboardMobile(displayName, chalkboard, field, value)
        .then((res) => {
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
          let registrationToken = localStorage.getItem('registrationToken');
          
          console.log(`Edited ${field} for ${chalkboard.title}`);
          this.props.updateChalkboardInfo();
          this.handleClose();

          if (isSafari || !registrationToken) {
            this.props.handleRequestOpen(`Edited ${field} for ${chalkboard.title}`);
          }
          else {
            API.sendEditedChalkboardNotification(chalkboard)
            .then(res => {
              this.props.handleRequestOpen(`Edited ${field} for ${chalkboard.title}`);         
            })
            .catch(err => console.log(err));
          }
        })
        .catch((error) => {
          console.log('Error: ', error);
          this.handleClose();
          this.props.handleRequestOpen(`Error editing ${field} for ${chalkboard.title}`);
        });
      }
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
          textFieldStyle={{display:'block',margin:'0 auto'}}
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
          textFieldStyle={{display:'block'}}
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
          style={{display:'block'}}
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
