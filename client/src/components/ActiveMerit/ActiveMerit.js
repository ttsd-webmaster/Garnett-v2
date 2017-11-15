import './ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import API from "../../API/API.js";

const listStyle = {
  textAlign: 'left'
};

const listItemStyle = {
  backgroundColor: '#fff',
  paddingLeft: '102px',
  zIndex: -1
};

const avatarStyle = {
  top: 8
};

const dividerStyle = {
  marginLeft: '102px'
};

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      pledge: null,
      description: '',
      amount: '',
      descriptionValidation: true,
      amountValidation: true
    };
  }

  merit = (pledge) => {
    let token = this.props.state.token;
    let pledgeName = pledge.firstName + pledge.lastName;
    let activeName = this.props.state.name;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let descriptionValidation = true;
    let amountValidation = true;

    if (!description || !amount) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount) {
        amountValidation = false;
      }

      this.setState({
        descriptionValidation: descriptionValidation,
        amountValidation: amountValidation,
      });
    }
    else {
      API.merit(token, pledgeName, activeName, description, amount, photoURL)
      .then(res => {
        console.log(res);

        this.setState({
          open: false,
          description: '',
          amount: ''
        });
      })
      .catch(err => console.log('err', err));
    }
  }

  handleChange(label, newValue) {
    let validationLabel = [label] + 'Validation';
    let value = newValue;

    if (label === 'amount') {
      value = parseInt(newValue)
    }

    this.setState({
      [label]: value,
      [validationLabel]: true
    });
  }

  handleOpen = (pledge) => {
    this.setState({
      open: true,
      pledge: pledge
    });
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Demerit"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Merit"
        primary={true}
        onClick={() => this.merit(this.state.pledge)}
      />,
    ];

    return (
      <div>
        <List style={listStyle}>
          {this.props.userArray.map((pledge, i) => (
            <div key={i}>
              <ListItem
                innerDivStyle={listItemStyle}
                leftAvatar={<Avatar size={70} src={pledge.photoURL} style={avatarStyle} />}
                primaryText={
                  <p className="pledge-name"> {pledge.firstName} {pledge.lastName} </p>
                }
                secondaryText={
                  <p>
                    {pledge.year}
                    <br />
                    {pledge.major}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.handleOpen(pledge)}
              >
                <p className="active-merits"> {pledge.totalMerits} </p>
              </ListItem>
              <Divider style={dividerStyle} inset={true} />
            </div>
          ))}
        </List>
        <Dialog
          title="Merit"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField 
            type="text"
            floatingLabelText="Description"
            value={this.state.description}
            onChange={(e, newValue) => this.handleChange('description', newValue)}
            errorText={!this.state.descriptionValidation && 'Enter a description'}
          />
          <TextField 
            type="number"
            floatingLabelText="Amount"
            value={this.state.amount}
            onChange={(e, newValue) => this.handleChange('amount', newValue)}
            errorText={!this.state.amountValidation && 'Enter an amount'}
          />
        </Dialog>
      </div>
    )
  }
}
