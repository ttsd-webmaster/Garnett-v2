import { androidBackOpen, androidBackClose } from 'helpers/functions.js';
import { LoadableHandleComplaintDialog } from './Dialogs';
import { FilterHeader } from 'components';

import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export default class MyComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedComplaint: null
    };
  }

  handleOpen = (complaint) => {
    if (navigator.onLine) {
      androidBackOpen(this.handleClose);
      this.setState({
        open: true,
        selectedComplaint: complaint
      });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleClose = () => {
    androidBackClose();
    this.setState({ open: false });
  }

  render() {
    let { approvedComplaints, pendingComplaints } = this.props;

    if (this.props.reverse) {
      approvedComplaints = approvedComplaints.slice().reverse();
      pendingComplaints = pendingComplaints.slice().reverse();
    }

    return (
      <div id="my-complaints" className="active">
        <FilterHeader
          title="Approved"
          isReversed={this.props.reverse}
          reverse={this.props.reverseComplaints}
        />
        
        <List className="garnett-list">
          {approvedComplaints.map((complaint, i) => (
            <div key={i}>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="garnett-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))}
        </List>

        <Divider className="garnett-subheader" />

        <Subheader className="garnett-subheader"> Pending </Subheader>
        <List className="garnett-list">
          {pendingComplaints.map((complaint, i) => (
            <div key={i}>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.handleOpen(complaint)}
              >
                <p className="garnett-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))}
        </List>

        <LoadableHandleComplaintDialog
          open={this.state.open}
          state={this.props.state}
          complaint={this.state.selectedComplaint}
          handleClose={this.handleClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      </div>
    )
  }
}
