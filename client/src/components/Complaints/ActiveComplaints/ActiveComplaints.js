import './ActiveComplaints.css';

import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import API from "../../../api/API.js";

export default class ActiveComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      pledge: null,
      description: '',
      pledgeArray: [],
      complaintsArray: [],
      pledgeValidation: true,
      descriptionValidation: true
    };
  }

  componentDidMount() {
    let pledgeArray = [];

    pledgeArray = this.props.pledgeArray.map(function(pledge) {
      return {'value': pledge.firstName + pledge.lastName, 
              'label': `${pledge.firstName} ${pledge.lastName}`};
    });

    this.setState({
      pledgeArray: pledgeArray
    });
  }

  complain = (pledge) => {
    let token = this.props.state.token;
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
      API.complain(token, activeName, pledge.value, description)
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
      <div className="complaints-container">
        <SelectField
          className="complaints-input"
          value={this.state.pledge}
          floatingLabelText="Pledge Name"
          onChange={(e, key, newValue) => this.handleChange('pledge', newValue)}
          errorText={!this.state.pledgeValidation && 'Please select a pledge.'}
        >
          {this.state.pledgeArray.map((pledge, i) => (
            <MenuItem key={i} value={pledge} primaryText={pledge.label} />
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
