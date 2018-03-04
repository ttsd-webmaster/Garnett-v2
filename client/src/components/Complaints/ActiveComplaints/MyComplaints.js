import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const LoadableAddComplaintDialog = Loadable({
  loader: () => import('./AddComplaintDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

const LoadableApproveComplaintDialog = Loadable({
  loader: () => import('./ApproveComplaintDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

export default class MyComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openApprove: false,
      selectedComplaint: null
    };
  }

  componentDidUpdate() {
    let addComplaint = document.getElementById('add-complaint');

    if (this.props.index === 3 && this.props.selectedIndex === 0) {
      addComplaint.style.display = 'flex';
    }
    else {
      addComplaint.style.display = 'none';
    }
  }

  handleOpen = () => {
    if (navigator.onLine) {
      this.setState({
        open: true
      });
    }
    else {
      this.handleRequestOpen('You are offline.');
    }
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  handleApproveOpen = (complaint) => {
    if (navigator.onLine) {
      this.setState({
        openApprove: true,
        selectedComplaint: complaint
      });
    }
    else {
      this.handleRequestOpen('You are offline.');
    }
  }

  handleApproveClose = () => {
    this.setState({
      openApprove: false
    });
  }

  render() {
    return (
      <div id="my-complaints" className="active">
        <List className="pledge-list">
          <Subheader> Approved </Subheader>
          {this.props.approvedComplaintsArray.map((complaint, i) => (
            <div key={i}>
              <Divider className="pledge-divider large" inset={true} />
              <ListItem
                className="pledge-list-item large"
                leftAvatar={<Avatar className="pledge-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="pledge-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="complaints-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="complaints-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="pledge-divider large" inset={true} />
            </div>
          ))}

          <Divider />

          <Subheader> Pending </Subheader>
          {this.props.pendingComplaintsArray.map((complaint, i) => (
            <div key={i}>
              <Divider className="pledge-divider large" inset={true} />
              <ListItem
                className="pledge-list-item large"
                leftAvatar={<Avatar className="pledge-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="pledge-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="complaints-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => {
                  if (this.props.state.status !== 'active') {
                    this.handleApproveOpen(complaint)
                  }
                }}
              >
                <p className="complaints-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="pledge-divider large" inset={true} />
            </div>
          ))}
        </List>

        <div id="add-complaint" className="fixed-button hidden" onClick={this.handleOpen}>
          <i className="icon-pencil"></i>
        </div>

        <LoadableAddComplaintDialog
          open={this.state.open}
          state={this.props.state}
          pledgeArray={this.props.pledgeArray}
          handleClose={this.handleClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />

        <LoadableApproveComplaintDialog
          open={this.state.openApprove}
          state={this.props.state}
          complaint={this.state.selectedComplaint}
          handleClose={this.handleApproveClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      </div>
    )
  }
}