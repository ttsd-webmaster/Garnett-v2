import API from "../../../api/API.js";

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class ApproveComplaintDialog extends Component {
  approve = (complaint) => {
    API.approveComplaint(complaint)
    .then((res) => {
      console.log('Approved Complaint');
      this.props.handleClose();
      this.props.handleRequestOpen(`Approved complaint for ${complaint.pledgeName}`);
    })
    .catch((error) => {
      console.log('Error: ', error)
      this.props.handleClose();
      this.props.handleRequestOpen('Error approving complaint');
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
        label="Approve"
        primary={true}
        onClick={() => this.approve(this.props.complaint)}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        Approve Complaint?
      </Dialog>
    )
  }
}
