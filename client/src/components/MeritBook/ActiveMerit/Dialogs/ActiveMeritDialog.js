import '../../MeritBook.css';
import {getDate} from '../../../../helpers/functions.js';
import {CompletingTaskDialog} from '../../../../helpers/loaders.js';
import API from '../../../../api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

const checkboxStyle = {
  left: '50%',
  width: 'max-content',
  marginTop: '20px',
  transform: 'translateX(-130px)'
};

export default class ActiveMeritDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledges: [],
      selectedPledges: [],
      description: '',
      isChalkboard: false,
      amount: 0,
      chalkboards: null,
      pledgeValidation: true,
      descriptionValidation: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (navigator.onLine && this.props !== nextProps) {
      API.getPledgesForMerit(nextProps.state.displayName)
      .then((res) => {
        let pledges = res.data;

        this.setState({
          pledges: pledges
        });
      });
    }
  }

  merit = (type) => {
    let pledges = this.state.selectedPledges;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let pledgeValidation = true;
    let descriptionValidation = true;

    if (typeof description === 'object') {
      description = description.title;
    }

    if (pledges.length === 0 || !description || description.length > 50 || amount === 0) {
      if (pledges.length === 0) {
        pledgeValidation = false;
      }
      if (!description || description.length > 50) {
        descriptionValidation = false;
      }

      this.setState({
        pledgeValidation: pledgeValidation,
        descriptionValidation: descriptionValidation
      });
    }
    else {
      let displayName = this.props.state.displayName;
      let activeName = this.props.state.name;
      let status = this.props.state.status;
      let isChalkboard = this.state.isChalkboard;
      let action = 'Merited';
      let date = getDate();

      if (type === 'demerit') {
        amount = -amount;
        action = 'Demerited';
      }
      if (isChalkboard) {
        description = 'Chalkboard: ' + description;
      }

      this.setState({
        openCompletingTask: true,
        completingTaskMessage: 'Meriting pledges...'
      });

      API.merit(displayName, activeName, pledges, description, amount, photoURL, date, isChalkboard, status)
      .then(res => {
        console.log(res);
        this.handleClose();
        this.setState({
          openCompletingTask: false
        });

        API.sendActiveMeritNotification(activeName, pledges, amount)
        .then(res => {
          this.props.handleRequestOpen(`${action} pledges: ${amount} merits`);
        })
        .catch(err => console.log(err));
      })
      .catch((error) => {
        console.log(error)
        let pledge = error.response.data;

        console.log('Not enough merits for ', pledge);
        this.handleClose();
        this.setState({
          openCompletingTask: false
        });
        this.props.handleRequestOpen(`Not enough merits for ${pledge}.`);
      });
    }
  }

  handleChange = (label, newValue) => {
    let validationLabel = [label] + 'Validation';
    let value = newValue;

    if (label === 'amount') {
      value = parseInt(newValue, 10)
    }
    else if (label === 'isChalkboard') {  
      let amount = this.state.amount;

      if (newValue === true) {
        let fullName = this.props.state.name;

        if (this.props.state.status === 'pipm') {
          let maxAmount = 100;

          if (amount > maxAmount) {
            this.setState({
              amount: maxAmount
            });
          }
        }

        API.getChalkboardsForMerit(fullName)
        .then((res) => {
          let chalkboards = res.data;

          this.setState({
            chalkboards: chalkboards,
            description: ''
          });
        })
        .catch((err) => {
          console.log(err);
        })
      }
      else {
        let maxAmount = 35;

        if (this.props.state.status === 'alumni') {
          maxAmount = 50;
        }

        if (amount > maxAmount) {
          amount = maxAmount;
        }

        this.setState({
          description: '',
          amount: amount
        });
      }
    }
    else if (label === 'description' && this.state.isChalkboard) {
      value = newValue;

      this.setState({
        amount: newValue.amount
      });
    }

    this.setState({
      [label]: value,
      [validationLabel]: true
    });
  }

  handleClose = () => {
    this.props.handleMeritClose();

    this.setState({
      selectedPledges: [],
      description: '',
      isChalkboard: false,
      amount: 0,
      chalkboards: null,
      pledgeValidation: true,
      descriptionValidation: true
    });
  }

  render() {
    let maxAmount = 35;

    if (this.state.isChalkboard) {
      maxAmount = 100;
    }
    else if (this.props.state.status === 'pipm') {
      maxAmount = 500;
    }
    else if (this.props.state.status === 'alumni') {
      maxAmount = 50;
    }

    const actions = [
      <FlatButton
        label="Demerit"
        primary={true}
        onClick={() => this.merit('demerit')}
      />,
      <FlatButton
        label="Merit"
        primary={true}
        onClick={() => this.merit('merit')}
      />,
    ];

    return (
      <Dialog
        title="Merit"
        titleClassName="garnett-dialog-title"
        actions={actions}
        modal={false}
        bodyClassName="garnett-dialog-body"
        contentClassName="garnett-dialog-content"
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <SelectField
          className="garnett-input"
          value={this.state.selectedPledges}
          floatingLabelText="Pledge Name"
          maxHeight={345}
          multiple={true}
          onChange={(e, key, newValues) => this.handleChange('selectedPledges', newValues)}
          errorText={!this.state.pledgeValidation && 'Please select a pledge.'}
        >
          {this.state.pledges.map((pledge, i) => (
            <MenuItem
              key={i}
              value={pledge}
              primaryText={pledge.label}
              insetChildren
              checked={
                this.state.selectedPledges && 
                this.state.selectedPledges.indexOf(pledge) > -1
              }
            />
          ))}
        </SelectField>

        {this.state.isChalkboard ? (
          <SelectField
            className="garnett-input"
            value={this.state.description}
            floatingLabelText="Chalkboard Title"
            onChange={(e, key, newValue) => this.handleChange('description', newValue)}
            errorText={!this.state.descriptionValidation && 'Please select a chalkboard.'}
          >
            {this.state.chalkboards && (
              this.state.chalkboards.map((chalkboard, i) => (
                <MenuItem
                  key={i}
                  value={chalkboard}
                  primaryText={chalkboard.title}
                  insetChildren
                  checked={chalkboard.title === this.state.description}
                />
              ))
            )}
          </SelectField>
        ) : (
          <TextField
            className="garnett-input"
            type="text"
            floatingLabelText="Description"
            multiLine={true}
            rowsMax={3}
            value={this.state.description}
            onChange={(e, newValue) => this.handleChange('description', newValue)}
            errorText={!this.state.descriptionValidation && 'Enter a description less than 50 characters.'}
          />
        )}

        <div style={{width:'256px',margin:'20px auto 0'}}>
          <span>
            Amount: {this.state.amount} merits
          </span>
          <Slider
            sliderStyle={{marginBottom:0}}
            name="Amount"
            min={0}
            max={maxAmount}
            step={5}
            value={this.state.amount}
            onChange={(e, newValue) => this.handleChange('amount', newValue)}
          />
        </div>
        <Checkbox
          style={checkboxStyle}
          label="Chalkboard"
          checked={this.state.isChalkboard}
          onCheck={(e, newValue) => this.handleChange('isChalkboard', newValue)}
        />

        <div id="remaining-merits">
          {this.state.selectedPledges.map((pledge, i) => (
            <p key={i}> Merits remaining for {pledge.label}: {pledge.meritsRemaining} </p>
          ))}
        </div>

        {this.state.openCompletingTask &&
          <CompletingTaskDialog
            open={this.state.openCompletingTask}
            message={this.state.completingTaskMessage}
          />
        }
      </Dialog>
    )
  }
}
