import {getDate} from '../../../helpers/functions.js';
import API from "../../../api/API.js";

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class AddComplaintDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledge: null,
      description: '',
      pledgeArray: this.props.pledgeArray,
      pledgeValidation: true,
      descriptionValidation: true
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      API.getPledgesForComplaints()
      .then((res) => {
        let pledgeArray = res.data;

        console.log('Complaints Pledge Array: ', pledgeArray);
        localStorage.setItem('complaintsPledgeArray', JSON.stringify(pledgeArray));

        this.setState({
          pledgeArray: pledgeArray
        });
      });
    }
  }

  complain = (pledge) => {
    let status = this.props.state.status;
    let displayName = this.props.state.displayName;
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
      let date = getDate();
      
      API.complain(status, displayName, activeName, pledge, description, date)
      .then((res) => {
        console.log(res);
        this.props.handleClose();
        this.props.handleRequestOpen(`Created a complaint for ${pledge.label}`);

        this.setState({
          description: '',
          pledge: null
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.props.handleClose();
        this.props.handleRequestOpen('Error creating complaint');
      });
    }
  }

  handleChange = (label, value) => {
    let validationLabel = [label] + 'Validation';

    this.setState({
      [label]: value,
      [validationLabel]: true
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        onClick={() => this.complain(this.state.pledge)}
      />,
    ];

    return (
      <Dialog
        title="Submit Complaint"
        titleClassName="garnett-all-dialog"
        actions={actions}
        modal={false}
        className="garnett-dialog"
        bodyClassName="garnett-dialog-body"
        contentClassName="garnett-dialog-content"
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        <div id="add-complaint-container">
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
        </div>
      </Dialog>
    )
  }
}
