import {getDate} from '../../../../helpers/functions.js';
import API from '../../../../api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class AddComplaintDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledges: this.props.pledges,
      pledge: null,
      description: '',
      pledgeValidation: true,
      descriptionValidation: true
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      API.getPledgesForComplaints()
      .then((res) => {
        let pledges = res.data;

        localStorage.setItem('complaintsPledgeArray', JSON.stringify(pledges));

        this.setState({
          pledges: pledges
        });
      });
    }
  }

  complain = () => {
    let pledge = this.state.pledge;
    let description = this.state.description;
    let descriptionValidation = true;
    let pledgeValidation = true;

    if (!pledge || !description || description.length > 45) {
      if (!pledge) {
        pledgeValidation = false;
      }
      if (!description || description.length > 45) {
        descriptionValidation = false;
      }

      this.setState({
        pledgeValidation: pledgeValidation,
        descriptionValidation: descriptionValidation
      });
    }
    else {
      let status = this.props.state.status;
      let displayName = this.props.state.displayName;
      let activeName = this.props.state.name;
      let date = getDate();
      let complaint = {
        activeDisplayName: displayName,
        activeName: activeName,
        pledgeDisplayName: pledge.value,
        pledgeName: pledge.label,
        description: description,
        photoURL: pledge.photoURL,
        date: date
      };
      
      API.complain(complaint)
      .then((res) => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        let registrationToken = localStorage.getItem('registrationToken');
        
        console.log(res);
        this.handleClose();

        if (isSafari || !registrationToken || status !== 'pipm') {
          this.props.handleRequestOpen(`Created a complaint for ${pledge.label}`);
        }
        else {
          API.sendComplaintNotification(complaint)
          .then(res => {
            this.props.handleRequestOpen(`Created a complaint for ${pledge.label}`);
          })
          .catch(err => console.log(err));
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.handleClose();
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

  handleClose = () => {
    this.props.handleClose();

    this.setState({
      pledge: null,
      description: '',
      pledgeValidation: true,
      descriptionValidation: true
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        onClick={this.complain}
      />,
    ];

    return (
      <Dialog
        title="New Complaint"
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
          value={this.state.pledge}
          floatingLabelText="Pledge Name"
          onChange={(e, key, newValue) => this.handleChange('pledge', newValue)}
          errorText={!this.state.pledgeValidation && 'Please select a pledge.'}
        >
          {this.state.pledges.map((pledge, i) => (
            <MenuItem
              key={i}
              value={pledge}
              primaryText={pledge.label}
              insetChildren
              checked={pledge === this.state.pledge}
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
          errorText={(!this.state.descriptionValidation && 'Enter a description less than two lines.')}
        />
      </Dialog>
    )
  }
}
