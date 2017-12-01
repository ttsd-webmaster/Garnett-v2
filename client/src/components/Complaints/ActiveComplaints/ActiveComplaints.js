import './ActiveComplaints.css';
import {loadFirebase} from '../../../helpers/functions.js';
import API from "../../../api/API.js";

import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ActiveComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      pledge: null,
      description: '',
      pledgeArray: this.props.pledgeArray,
      pledgeValidation: true,
      descriptionValidation: true
    };
  }

  componentDidMount() {
    let pledgeArray = this.state.pledgeArray;

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let dbRef = firebase.database().ref('/users/');

        dbRef.on('value', (snapshot) => {
          pledgeArray = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          });
          pledgeArray = pledgeArray.filter(function(user) {
            return user.status === 'pledge';
          });
          pledgeArray = pledgeArray.map(function(pledge) {
            return {'value': pledge.firstName + pledge.lastName, 
                    'label': `${pledge.firstName} ${pledge.lastName}`};
          });

          console.log('Pledge Complaints Array: ', pledgeArray);

          localStorage.setItem('pledgeComplaintsArray', JSON.stringify(pledgeArray));
          
          this.setState({
            pledgeArray: pledgeArray
          });
        });
      });
    }
    else {
      let pledgeArray = JSON.parse(localStorage.getItem('pledgeComplaintsArray'));

      this.setState({
        pledgeArray: pledgeArray
      });
    }
  }

  complain = (pledge) => {
    let activeName = this.props.state.name;
    let description = this.state.description;
    let descriptionValidation = true;
    let pledgeValidation = true;

    if (!pledge || !description) {
      if (!pledge) {
        pledgeValidation = false;
      }
      if (!description) {
        descriptionValidation = false;
      }

      this.setState({
        pledgeValidation: pledgeValidation,
        descriptionValidation: descriptionValidation
      });
    }
    else {
      API.complain(activeName, pledge, description)
      .then(res => {
        console.log(res);
        this.props.handleRequestOpen(`Created a complaint for ${pledge.label}`);

        this.setState({
          open: false,
          description: '',
          pledge: null
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

  render() {
    return (
      <div id="complaints-container">
        <SelectField
          className="complaints-input"
          value={this.state.pledge}
          floatingLabelText="Pledge Name"
          onChange={(e, key, newValue) => this.handleChange('pledge', newValue)}
          errorText={!this.state.pledgeValidation && 'Please select a pledge.'}
        >
          {this.state.pledgeArray.map((pledge, i) => (
            <MenuItem key={i} value={pledge.value} primaryText={pledge.label} />
          ))}
        </SelectField>
        <TextField
          className="complaints-input"
          type="text"
          floatingLabelText="Description"
          multiLine={true}
          rowsMax={3}
          value={this.state.description}
          onChange={(e, newValue) => this.handleChange('description', newValue)}
          errorText={!this.state.descriptionValidation && 'Enter a description.'}
        />
        <div style={{height: '60px'}}></div>
        <div className="complain-button" onClick={() => this.complain(this.state.pledge)}> 
          Submit Complaint
        </div>
      </div>
    )
  }
}
