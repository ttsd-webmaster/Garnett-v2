import '../../MeritBook.css';
import {getDate} from '../../../../helpers/functions.js';
import API from '../../../../api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';


export default class ActiveMeritDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledges: this.props.pledges,
      selectedPledges: [],
      description: '',
      amount: '',
      pledgeValidation: true,
      descriptionValidation: true,
      amountValidation: true,
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      API.getPledgesForMerit(this.props.state.displayName)
      .then((res) => {
        let pledges = res.data;

        localStorage.setItem('meritPledgeArray', JSON.stringify(pledges));

        this.setState({
          pledges: pledges
        });
      });
    }
  }

  merit = (type) => {
    let status = this.props.state.status;
    let displayName = this.props.state.displayName;
    let activeName = this.props.state.name;
    let pledges = this.state.selectedPledges;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let pledgeValidation = true;
    let descriptionValidation = true;
    let amountValidation = true;
    let maxAmount;

    console.log(pledges)
    if (status === 'alumni') {
      maxAmount = 50;
    }
    else {
      maxAmount = 30;
    }

    if (!pledges || !description || description.length > 45 || !amount || amount < 0) {
      if (!pledges) {
        pledgeValidation = false;
      }
      if (!description || description.length > 45) {
        descriptionValidation = false;
      }
      if (!amount || amount > maxAmount || amount < 0) {
        amountValidation = false;
      }

      this.setState({
        pledgeValidation: pledgeValidation,
        descriptionValidation: descriptionValidation,
        amountValidation: amountValidation,
      });
    }
    else {
      let action;
      let date = getDate();

      if (type === 'demerit') {
        amount = -amount;
        action = 'Demerited';
      }
      else {
        action = 'Merited';
      }

      API.merit(displayName, activeName, pledges, description, amount, photoURL, date)
      .then(res => {
        console.log(res);
        this.handleClose();
        this.props.handleRequestOpen(`${action} pledges: ${amount} merits`);
      })
      .catch((error) => {
        console.log(error)
        let pledge = error.response.data;

        console.log('Not enough merits for ', pledge);
        this.handleClose();
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
      amount: '',
      pledgeValidation: true,
      descriptionValidation: true,
      amountValidation: true
    });
  }

  render(){
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
        <TextField
          className="garnett-input"
          type="number"
          step={5}
          max={30}
          floatingLabelText="Amount"
          value={this.state.amount}
          onChange={(e, newValue) => this.handleChange('amount', newValue)}
          errorText={!this.state.amountValidation && 'Enter a valid amount.'}
        />

        <div id="remaining-merits">
          {this.state.selectedPledges.map((pledge, i) => (
            <p key={i}> Remaining Merits for {pledge.label}: {pledge.remainingMerits} </p>
          ))}
        </div>
      </Dialog>
    )
  }
}
