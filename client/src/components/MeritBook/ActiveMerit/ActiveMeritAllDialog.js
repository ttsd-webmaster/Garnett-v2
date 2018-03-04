import '../MeritBook.css';
import {getDate} from '../../../helpers/functions.js';
import API from '../../../api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';


export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      amount: '',
      descriptionValidation: true,
      amountValidation: true,
    };
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
    this.props.handleMeritAllClose();

    this.setState({
      description: '',
      amount: '',
      descriptionValidation: true,
      amountValidation: true
    });
  }

  meritAll = () => {
    let displayName = this.props.state.displayName;
    let activeName = this.props.state.name;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let descriptionValidation = true;
    let amountValidation = true;

    if (!description || !amount || amount < 0) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount || amount < 0) {
        amountValidation = false;
      }

      this.setState({
        descriptionValidation: descriptionValidation,
        amountValidation: amountValidation,
      });
    }
    else {
      let date = getDate();

      API.meritAll(displayName, activeName, description, amount, photoURL, date)
      .then(res => {
        console.log(res);
        this.props.handleMeritAllClose();
        this.props.handleRequestOpen(`Merited all pledges: ${amount} merits`);

        this.setState({
          description: '',
          amount: ''
        });
      })
      .catch((error) => {
        console.log(error)
        let pledge = error.response.data;

        console.log('Not enough merits for ', pledge);
        this.props.handleRequestOpen(`Not enough merits for ${pledge}.`);
      });
    }
  }

  demeritAll = () => {
    let displayName = this.props.state.displayName;
    let activeName = this.props.state.name;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let descriptionValidation = true;
    let amountValidation = true;

    if (!description || !amount || amount < 0) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount || amount < 0) {
        amountValidation = false;
      }

      this.setState({
        descriptionValidation: descriptionValidation,
        amountValidation: amountValidation,
      });
    }
    else {
      let date = getDate();

      API.meritAll(displayName, activeName, description, -amount, photoURL, date)
      .then(res => {
        console.log(res);
        this.props.handleMeritAllClose();
        this.props.handleRequestOpen(`Demerited all pledges: ${amount} merits`);

        this.setState({
          description: '',
          amount: ''
        });
      })
      .catch((err) => console.log('err', err));
    }
  }

  render(){
    const actions = [
      <FlatButton
        label="Demerit"
        primary={true}
        onClick={this.demeritAll}
      />,
      <FlatButton
        label="Merit"
        primary={true}
        onClick={this.meritAll}
      />,
    ];

    return (
      <Dialog
        title="Merit All"
        titleClassName="garnett-all-dialog"
        actions={actions}
        modal={false}
        className="garnett-dialog"
        bodyClassName="garnett-dialog-body no-tabs"
        contentClassName="garnett-dialog-content"
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <div className="garnett-container">
          <TextField 
            type="text"
            floatingLabelText="Description"
            value={this.state.description}
            onChange={(e, newValue) => this.handleChange('description', newValue)}
            errorText={!this.state.descriptionValidation && 'Enter a description.'}
          />
          <br />
          <TextField 
            type="number"
            step={5}
            max={30}
            floatingLabelText="Amount"
            value={this.state.amount}
            onChange={(e, newValue) => this.handleChange('amount', newValue)}
            errorText={!this.state.amountValidation && 'Enter a valid amount.'}
          />
        </div>
      </Dialog>
    )
  }
}
