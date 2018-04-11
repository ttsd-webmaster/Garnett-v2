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


export default class PledgeMeritDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actives: this.props.actives,
      selectedActives: [],
      description: '',
      amount: 0,
      activeValidation: true,
      descriptionValidation: true
    };
  }

  componentWillReceiveProps() {
    if (navigator.onLine) {
      API.getActivesForMerit(this.props.state.displayName)
      .then((res) => {
        let actives = res.data;

        localStorage.setItem('meritActiveArray', JSON.stringify(actives));

        this.setState({
          actives: actives
        });
      });
    }
  }

  merit = (type) => {
    let displayName = this.props.state.displayName;
    let actives = this.state.selectedActives;
    let description = this.state.description;
    let amount = this.state.amount;
    let activeValidation = true;
    let descriptionValidation = true;

    if (actives.length === 0 || !description || description.length > 45 || amount === 0) {
      if (actives.length === 0) {
        activeValidation = false;
      }
      if (!description || description.length > 45) {
        descriptionValidation = false;
      }

      this.setState({
        activeValidation: activeValidation,
        descriptionValidation: descriptionValidation
      });
    }
    else {
      let action = 'Merited';
      let date = getDate();

      if (type === 'demerit') {
        amount = -amount;
        action = 'Demerited';
      }

      this.setState({
        openCompletingTask: true,
        completingTaskMessage: 'Meriting pledges...'
      });

      API.meritAsPledge(displayName, actives, description, amount, date)
      .then(res => {
        let totalAmount = amount * actives.length;

        console.log(res);
        this.handleClose();
        this.setState({
          openCompletingTask: false
        });
        this.props.handleRequestOpen(`${action} for ${totalAmount} merits`);
      })
      .catch((error) => {
        console.log(error)
        let active = error.response.data;

        console.log('Not enough merits for ', active);
        this.handleClose();
        this.setState({
          openCompletingTask: false
        });
        this.props.handleRequestOpen(`${active} does not have enough merits.`);
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
    this.props.handleClose();

    this.setState({
      selectedActives: [],
      description: '',
      amount: 0,
      activeValidation: true,
      descriptionValidation: true
    });
  }

  render(){
    let maxAmount = 30;

    if (this.props.state.status === 'alumni') {
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
          value={this.state.selectedActives}
          floatingLabelText="Active Name"
          multiple={true}
          onChange={(e, key, newValues) => this.handleChange('selectedActives', newValues)}
          errorText={!this.state.activeValidation && 'Please select an active.'}
        >
          {this.state.actives.map((active, i) => (
            <MenuItem
              key={i}
              value={active}
              primaryText={active.label}
              insetChildren
              checked={
                this.state.selectedActives && 
                this.state.selectedActives.indexOf(active) > -1
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

        <div id="remaining-merits">
          {this.state.selectedActives.map((active, i) => (
            <p key={i}> Remaining Merits for {active.label}: {active.remainingMerits} </p>
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
