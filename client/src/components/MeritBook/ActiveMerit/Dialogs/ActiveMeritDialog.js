import '../../MeritBook.css';
import { getDate } from 'helpers/functions.js';
import { CompletingTaskDialog } from 'helpers/loaders.js';
import API from 'api/API.js';

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
  width: '250px',
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
      isPCGreet: false,
      allPledges: false,
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
        const pledges = res.data;

        this.setState({ pledges });
      });
    }
  }

  merit = (type) => {
    const { selectedPledges } = this.state;
    let { description, amount } = this.state;
    let pledgeValidation = true;
    let descriptionValidation = true;

    if (typeof description === 'object') {
      description = description.title;
    }

    if (selectedPledges.length === 0 || 
        !description || 
        description.length > 50 || 
        amount === 0) {
      if (selectedPledges.length === 0) {
        pledgeValidation = false;
      }
      if (!description || description.length > 50) {
        descriptionValidation = false;
      }

      this.setState({
        pledgeValidation,
        descriptionValidation
      });
    }
    else {
      const { displayName, name, photoURL, status } = this.props.state;
      const { isChalkboard, isPCGreet } = this.state;
      let action = 'Merited';
      const date = getDate();

      if (type === 'demerit') {
        amount = -amount;
        action = 'Demerited';
      }
      if (isChalkboard) {
        description = `Chalkboard: ${description}`;
      }

      this.setState({
        openCompletingTask: true,
        completingTaskMessage: 'Meriting pledges...'
      });

      const merit = { name, description, amount, photoURL, date };

      API.meritAsActive(displayName, selectedPledges, merit, isChalkboard, isPCGreet, status)
      .then(res => {
        console.log(res);
        this.handleClose();
        this.setState({
          openCompletingTask: false
        });

        API.sendActiveMeritNotification(name, selectedPledges, amount)
        .then(res => {
          this.props.handleRequestOpen(`${action} pledges: ${amount} merits`);
        })
        .catch(error => console.log(`Error: ${error}`));
      })
      .catch((error) => {
        console.log(error)
        const pledge = error.response.data;

        console.log(`Not enough merits for ${pledge}`);
        this.handleClose();
        this.setState({
          openCompletingTask: false
        });
        this.props.handleRequestOpen(`Not enough merits for ${pledge}`);
      });
    }
  }

  handleChange = (label, newValue) => {
    const validationLabel = [label] + 'Validation';
    let value = newValue;
    const { pledges, isChalkboard, allPledges } = this.state;
    let { amount } = this.state;

    switch (label) {
      case 'amount':
        value = parseInt(newValue, 10);
        break;
      case 'isChalkboard':
        let maxAmount;

        if (newValue === true) {
          const { name } = this.props.state;

          // Only affects pipm since their max merit cap is 500
          if (this.props.state.status === 'pipm') {
            maxAmount = 100;

            if (amount > maxAmount) {
              amount = maxAmount;
              this.setState({ amount });
            }
          }

          API.getChalkboardsForMerit(name)
          .then((res) => {
            let chalkboards = res.data;

            this.setState({
              chalkboards,
              description: '',
              isPCGreet: false
            });
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          })
        }
        else {
          maxAmount = 50;

          if (this.props.state.status === 'alumni') {
            maxAmount = 100;
          }

          if (amount > maxAmount) {
            amount = maxAmount;
          }

          this.setState({
            amount,
            description: ''
          });
        }
        break;
      case 'description':
        if (isChalkboard) {
          value = newValue;
          amount = newValue.amount;

          this.setState({ amount });
        }
        break;
      case 'isPCGreet':
        this.setState({
          amount: 5,
          isChalkboard: false
        });
        break;
      case 'allPledges':
        let selectedPledges = [];

        if (allPledges === false) {
          selectedPledges = pledges;
        }

        this.setState({ selectedPledges });
        break;
      default:
    }

    this.setState({
      [label]: value,
      [validationLabel]: true
    }, () => {
      if (label === 'selectedPledges') {
        const { selectedPledges } = this.state;
        let allPledges = false;

        if (pledges.length === selectedPledges.length) {
          allPledges = true;
        }

        this.setState({ allPledges });
      }
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
    let maxAmount = 100;

    if (this.state.isChalkboard) {
      maxAmount = 100;
    }
    else if (this.props.state.status === 'pipm') {
      maxAmount = 500;
    }
    else if (this.props.state.status === 'alumni') {
      maxAmount = 100;
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
          onChange={(e, key, newValue) => this.handleChange('selectedPledges', newValue)}
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
                  checked={chalkboard === this.state.description}
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
            sliderStyle={{ marginBottom: 0 }}
            name="Amount"
            min={0}
            max={maxAmount}
            step={5}
            value={this.state.amount}
            disabled={this.state.isPCGreet}
            onChange={(e, newValue) => this.handleChange('amount', newValue)}
          />
        </div>
        <Checkbox
          style={checkboxStyle}
          label="Chalkboard"
          checked={this.state.isChalkboard}
          onCheck={(e, newValue) => this.handleChange('isChalkboard', newValue)}
        />
        <Checkbox
          style={checkboxStyle}
          label="PC Greet"
          checked={this.state.isPCGreet}
          onCheck={(e, newValue) => this.handleChange('isPCGreet', newValue)}
        />
        <Checkbox
          style={checkboxStyle}
          label="All Pledges"
          checked={this.state.allPledges}
          onCheck={(e, newValue) => this.handleChange('allPledges', newValue)}
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
