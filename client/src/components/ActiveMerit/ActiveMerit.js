import './ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import API from "../../api/API.js";

const inkBarStyle = {
  position: 'relative',
  top: '48px'
};

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      pledge: null,
      description: '',
      amount: '',
      meritArray: [],
      remainingMerits: '',
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

    if (!description || !amount || amount > 30) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount || amount > 30) {
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
    API.getActiveMerits(pledge)
    .then(res => {
      this.setState({
        open: true,
        pledge: pledge,
        remainingMerits: res.data.remainingMerits,
        meritArray: res.data.meritArray
      });
    })
    .catch(err => console.log('err', err));
  }

  handleClose = () => {
    this.setState({
      open: false,
      descriptionValidation: true,
      amountValidation: true
    });
  }

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
        <List className="pledge-list">
          {this.props.pledgeArray.map((pledge, i) => (
            <div key={i}>
              <ListItem
                className="pledge-list-item large"
                leftAvatar={<Avatar className="pledge-image" size={70} src={pledge.photoURL} />}
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
                <p className="pledge-merits"> {pledge.totalMerits} </p>
              </ListItem>
              <Divider className="pledge-divider large" inset={true} />
            </div>
          ))}
        </List>
        <div style={{height: '60px'}}></div>
        
        <Dialog
          actions={actions}
          modal={false}
          className="merit-dialog"
          bodyClassName="merit-dialog-body"
          contentClassName="merit-dialog-content"
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <Tabs 
            className="merit-dialog-tabs"
            inkBarStyle={inkBarStyle}
          >
            <Tab label="Merits">
              <div className="merit-container">
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
                <p> Merits remaining: {this.state.remainingMerits} </p>
              </div>
            </Tab>
            <Tab label="Past Merits">
              <List className="pledge-list">
                {this.state.meritArray.map((merit, i) => (
                  <div key={i}>
                    <ListItem
                      className="pledge-list-item"
                      leftAvatar={<Avatar src={merit.photoURL} />}
                      primaryText={
                        <p className="merit-name"> {merit.name} </p>
                      }
                      secondaryText={
                        <p>
                          {merit.description}
                        </p>
                      }
                    >
                      <p className="merit-amount small"> {merit.amount} </p>
                    </ListItem>
                    <Divider className="pledge-divider" inset={true} />
                  </div>
                ))}
              </List>
            </Tab>
          </Tabs>
        </Dialog>
      </div>
    )
  }
}
