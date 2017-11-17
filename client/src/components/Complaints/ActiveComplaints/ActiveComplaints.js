import '../../MeritBook/ActiveMerit/ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import API from "../../../api/API.js";

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      pledge: null,
      description: '',
      complaintsArray: [],
      descriptionValidation: true
    };
  }

  complain = (pledge) => {
    let token = this.props.state.token;
    let activeName = this.props.state.name;
    let pledgeName = pledge.firstName + pledge.lastName;
    let description = this.state.description;
    let descriptionValidation = true;

    if (!description) {
      descriptionValidation = false;

      this.setState({
        descriptionValidation: descriptionValidation,
      });
    }
    else {
      API.complain(token, activeName, pledgeName, description)
      .then(res => {
        console.log(res);
        this.props.handleRequestOpen(`Created a complaint for ${pledge.firstName} ${pledge.lastName}`);

        this.setState({
          open: false,
          description: ''
        });
      })
      .catch(err => console.log('err', err));
    }
  }

  handleChange(label, newValue) {
    let validationLabel = [label] + 'Validation';
    let value = newValue;

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
  }

  handleClose = () => {
    this.setState({
      open: false,
      description: '',
      amount: '',
      descriptionValidation: true,
      amountValidation: true
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Complain"
        primary={true}
        onClick={() => this.complain(this.state.pledge)}
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
              </ListItem>
              <Divider className="pledge-divider large" inset={true} />
            </div>
          ))}
        </List>
        <div style={{height: '60px'}}></div>
        
        <Dialog
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
            errorText={!this.state.descriptionValidation && 'Enter a description.'}
          />
        </Dialog>
      </div>
    )
  }
}
