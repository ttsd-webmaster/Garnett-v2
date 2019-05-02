import API from 'api/API.js';
import { getTabStyle, isMobile, mapsSelector } from 'helpers/functions.js';
import {
  LoadableAttendeeList,
  LoadableEditChalkboardDialog,
  LoadableEditChalkboardMobileDialog
} from './index.js';

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab} from 'material-ui/Tabs';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const inkBarStyle = {
  position: 'fixed',
  bottom: 'auto',
  marginTop: '46px',
  zIndex: 2
};

let EditChalkboardDialog;

if (isMobile()) {
  EditChalkboardDialog = LoadableEditChalkboardMobileDialog;
}
else {
  EditChalkboardDialog = LoadableEditChalkboardDialog;
}

export default class HandleChalkboardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chalkboard: null,
      open: false,
      field: '',
      index: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const chalkboard = nextProps.chalkboard;

    this.setState({ chalkboard, index: 0 });
  }

  // Joins the chalkboard
  join = (chalkboard) => {
    if (navigator.onLine) {
      const { name, photoURL } = this.props.state;

      API.joinChalkboard(name, photoURL, chalkboard.title)
      .then((res) => {
        console.log('Joined chalkboard');
        this.props.handleClose();

        API.sendJoinedChalkboardNotification(name, chalkboard)
        .then(res => {
          this.props.handleRequestOpen(`Joined ${chalkboard.title}`);
        })
        .catch(error => console.log(`Error: ${error}`));
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        this.props.handleClose();
        this.props.handleRequestOpen('Error joining chalkboard');
      });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  // Deletes the chalkboard
  delete = (chalkboard) => {
    if (navigator.onLine) {
      API.deleteChalkboard(chalkboard.title)
      .then((res) => {
        console.log('Deleted chalkboard');
        this.props.handleClose();
        this.props.handleRequestOpen(`Deleted ${chalkboard.title}`);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        this.props.handleClose();
        this.props.handleRequestOpen('Error deleting chalkboard');
      });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  // Leaves the chalkboard
  leave = (chalkboard) => {
    if (navigator.onLine) {
      const { name } = this.props.state;

      API.leaveChalkboard(name, chalkboard.title)
      .then((res) => {
        console.log('Left chalkboard');
        this.props.handleClose();

        API.sendLeftChalkboardNotification(name, chalkboard)
        .then(res => {
          this.props.handleRequestOpen(`Left ${chalkboard.title}`);
        })
        .catch(error => console.log(`Error: ${error}`));
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        this.props.handleClose();
        this.props.handleRequestOpen('Error leaving chalkboard');
      });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  // Updates the chalkboard information displayed
  updateChalkboardInfo = () => {
    const { title } = this.state.chalkboard;
    API.getChalkboardInfo(title)
    .then((res) => {
      const { chalkboard } = res.data;
      this.setState({ chalkboard });
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
  }

  // Updates the navigation tab index
  handleChange = (value) => {
    this.setState({ index: value });
  }

  // Opens the edit dialog if user is hosting chalkboard
  handleEditOpen = (field) => {
    if (navigator.onLine) {
      if (this.props.type === 'hosting') {
        // Handles android back button for edit dialog
        if (/android/i.test(navigator.userAgent)) {
          let path;
          if (process.env.NODE_ENV === 'development') {
            path = 'http://localhost:3000';
          }
          else {
            path = 'https://garnett-app.herokuapp.com';
          }

          window.history.pushState(null, null, path + window.location.pathname);
          window.onpopstate = () => {
            this.handleEditClose();
          }
        }

        this.setState({ field, open: true });
      }
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  // Closes the edit dialog
  handleEditClose = () => {
    // Handles android back button for this dialog
    if (/android/i.test(navigator.userAgent)) {
      let path;
      if (process.env.NODE_ENV === 'development') {
        path = 'http://localhost:3000';
      }
      else {
        path = 'https://garnett-app.herokuapp.com';
      }

      window.history.pushState(null, null, path + window.location.pathname);
      window.onpopstate = () => {
        this.props.handleClose();
      }
    }

    this.setState({
      open: false,
      field: ''
    });
  }

  render() {
    let label;

    switch (this.props.type) {
      case 'hosting':
        label = 'Delete';
        break;
      case 'attending':
        label = 'Leave';
        break;
      default:
        label = 'Join';
    }

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />,
      <RaisedButton
        label={label}
        primary={true}
        onClick={() => {
          if (this.props.type === 'hosting') {
            this.delete(this.state.chalkboard);
          }
          else if (this.props.type === 'attending') {
            this.leave(this.state.chalkboard);
          }
          else {
            this.join(this.state.chalkboard);
          }
        }}
      />
    ];

    const mobileAction = (
      <FlatButton
        label={label}
        primary={true}
        onClick={() => {
          if (this.props.type === 'hosting') {
            this.delete(this.state.chalkboard);
          }
          else if (this.props.type === 'attending') {
            this.leave(this.state.chalkboard);
          }
          else {
            this.join(this.state.chalkboard);
          }
        }}
      />
    );

    if (!this.state.chalkboard) {
      return null
    }

    return (
      <div>
        {isMobile() ? (
          <FullscreenDialog
            title="Chalkboard"
            titleStyle={{ fontSize: '22px' }}
            actionButton={mobileAction}
            open={this.props.open}
            onRequestClose={this.props.handleClose}
          >
            <Tabs 
              className="garnett-tabs"
              inkBarStyle={inkBarStyle}
              onChange={this.handleChange}
            >
              <Tab style={getTabStyle(this.state.index === 0)} label="Information" value={0}>
                <img className="user-photo" src={this.state.chalkboard.photoURL} alt="User" />
                <List>
                  <Divider />
                  <ListItem
                    className="garnett-list-item long"
                    primaryText="Title"
                    secondaryText={this.state.chalkboard.title}
                    leftIcon={
                      <i className="icon-info-circled garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Active Name"
                    secondaryText={this.state.chalkboard.activeName}
                    leftIcon={
                      <i className="icon-user garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item long"
                    primaryText="Description"
                    secondaryText={this.state.chalkboard.description}
                    leftIcon={
                      <i className="icon-list-alt garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Description')}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Date"
                    secondaryText={this.state.chalkboard.date}
                    leftIcon={
                      <i className="icon-calendar-check-o garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Date')}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Time"
                    secondaryText={this.state.chalkboard.time}
                    leftIcon={
                      <i className="icon-clock garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Time')}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Location"
                    secondaryText={this.state.chalkboard.location}
                    leftIcon={
                      <i className="icon-location garnett-icon"></i>
                    }
                    onClick={() => {
                      if (this.props.type === 'hosting') {
                        this.handleEditOpen('Location');
                      }
                      else {
                        mapsSelector(this.state.chalkboard.location);
                      }
                    }}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Time Commitment"
                    secondaryText={this.state.chalkboard.timeCommitment.label}
                    leftIcon={
                      <i className="icon-hourglass-o garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Time Commitment')}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Amount"
                    secondaryText={`${this.state.chalkboard.amount} merits`}
                    leftIcon={
                      <i className="icon-star garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Amount')}
                  />
                  <Divider className="garnett-divider" />
                </List>
              </Tab>
              <Tab style={getTabStyle(this.state.index === 1)} label="Attendees" value={1}>
                <LoadableAttendeeList
                  chalkboard={this.state.chalkboard}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              </Tab>
            </Tabs>
          </FullscreenDialog>
        ) : (
          <Dialog
            title={this.props.type === 'hosting' ? (
              <div>
                <span> Chalkboard </span>
                <i 
                  className="icon-edit edit-chalkboard"
                  onClick={this.handleEditOpen}
                >
                </i>
              </div>
            ) : (
              "Chalkboard"
            )}
            titleClassName="garnett-dialog-title"
            actions={actions}
            bodyClassName="garnett-dialog-body list"
            contentClassName="garnett-dialog-content"
            open={this.props.open}
            onRequestClose={this.props.handleClose}
            autoScrollBodyContent={true}
          >
            <Tabs 
              className="garnett-tabs"
              inkBarStyle={inkBarStyle}
              onChange={this.handleChange}
            >
              <Tab style={getTabStyle(this.state.index === 0)} label="Information" value={0}>
                <List style={{padding:'24px 0'}}>
                  <Divider />
                  <ListItem
                    className="garnett-list-item long"
                    primaryText="Title"
                    secondaryText={this.state.chalkboard.title}
                    leftIcon={
                      <i className="icon-info-circled garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Active Name"
                    secondaryText={this.state.chalkboard.activeName}
                    leftIcon={
                      <i className="icon-user garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item long"
                    primaryText="Description"
                    secondaryText={this.state.chalkboard.description}
                    leftIcon={
                      <i className="icon-list-alt garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Date"
                    secondaryText={this.state.chalkboard.date}
                    leftIcon={
                      <i className="icon-calendar-check-o garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Time"
                    secondaryText={this.state.chalkboard.time}
                    leftIcon={
                      <i className="icon-clock garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Location"
                    secondaryText={this.state.chalkboard.location}
                    leftIcon={
                      <i className="icon-location garnett-icon"></i>
                    }
                    onClick={() => {
                      mapsSelector(this.state.chalkboard.location);
                    }}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Time Commitment"
                    secondaryText={this.state.chalkboard.timeCommitment.label}
                    leftIcon={
                      <i className="icon-hourglass-o garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Amount"
                    secondaryText={`${this.state.chalkboard.amount} merits`}
                    leftIcon={
                      <i className="icon-star garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" />
                </List>
              </Tab>
              <Tab style={getTabStyle(this.state.index === 1)} label="Attendees" value={1}>
                <LoadableAttendeeList
                  chalkboard={this.state.chalkboard}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              </Tab>
            </Tabs>
          </Dialog>
        )}

        <EditChalkboardDialog
          open={this.state.open}
          state={this.props.state}
          field={this.state.field}
          chalkboard={this.state.chalkboard}
          updateChalkboardInfo={this.updateChalkboardInfo}
          handleClose={this.handleEditClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      </div>
    )
  }
}
