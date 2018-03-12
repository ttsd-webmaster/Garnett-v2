import './Chalkboards.css';
import API from '../../api/API.js';
import {getTabStyle} from '../../helpers/functions.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const listItemStyle = {
  backgroundColor: '#fff'
};

const inkBarStyle = {
  position: 'fixed',
  top: '124px',
  backgroundColor: 'var(--primary-color)',
  zIndex: 2
};

const LoadableAttendeeList = Loadable({
  loader: () => import('./AttendeeList'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

const LoadableEditChalkboardDialog = Loadable({
  loader: () => import('./EditChalkboardDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

export default class HandleChalkboardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      field: '',
      index: 0
    };
  }

  join = (chalkboard) => {
    let name = this.props.state.name;
    let photoURL = this.props.state.photoURL;

    API.joinChalkboard(name, photoURL, chalkboard)
    .then((res) => {
      console.log('Joined chalkboard');
      this.props.handleClose();
      this.props.handleRequestOpen(`Joined ${chalkboard.title}`);
    })
    .catch((error) => {
      console.log('Error: ', error);
      this.props.handleClose();
      this.props.handleRequestOpen('Error joining chalkboard');
    });
  }

  remove = (chalkboard) => {
    let displayName = this.props.state.displayName;

    API.removeChalkboard(displayName, chalkboard)
    .then((res) => {
      console.log('Removed chalkboard');
      this.props.handleClose();
      this.props.handleRequestOpen(`Removed ${chalkboard.title}`);
    })
    .catch((error) => {
      console.log('Error: ', error);
      this.props.handleClose();
      this.props.handleRequestOpen('Error removing chalkboard');
    });
  }

  leave = (chalkboard) => {
    let name = this.props.state.name;

    API.leaveChalkboard(name, chalkboard)
    .then((res) => {
      console.log('Left chalkboard');
      this.props.handleClose();
      this.props.handleRequestOpen(`Left ${chalkboard.title}`);
    })
    .catch((error) => {
      console.log('Error: ', error);
      this.props.handleClose();
      this.props.handleRequestOpen('Error leaving chalkboard');
    });
  }

  handleChange = (value) => {
    this.setState({
      index: value
    });
  }

  handleEditOpen = (field) => {
    if (this.props.type === 'hosting') {
      this.setState({
        open: true,
        field: field
      });
    }
  }

  handleEditClose = () => {
    this.setState({
      open: false,
      field: ''
    });
  }

  handleClose = () => {
    this.props.handleClose();

    this.setState({
      index: 0
    });
  }

  render() {
    let label;

    if (this.props.type === 'upcoming') {
      label = 'Join';
    }
    else if (this.props.type === 'attending') {
      label = 'Leave';
    }
    else {
      label = 'Remove';
    }

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
      this.props.type !== 'completed' && (
        <RaisedButton
          label={label}
          primary={true}
          onClick={() => {
            if (this.props.type === 'upcoming') {
              this.join(this.props.chalkboard);
            }
            else if (this.props.type === 'attending') {
              this.leave(this.props.chalkboard);
            }
            else {
              this.remove(this.props.chalkboard);
            }
          }}
        />
      ),
    ];

    return (
      this.props.chalkboard && (
        <div>
          <Dialog
            title={this.props.chalkboard.title}
            titleClassName="garnett-dialog-title"
            actions={actions}
            modal={false}
            className="garnett-dialog"
            bodyClassName="garnett-dialog-body tabs grey"
            contentClassName="garnett-dialog-content"
            open={this.props.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <Tabs 
              className="garnett-dialog-tabs chalkboard"
              inkBarStyle={inkBarStyle}
              onChange={this.handleChange}
            >
              <Tab style={getTabStyle(this.state.index === 0)} label="Information" value={0}>
                <List>
                  <Divider />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Active Name"
                    secondaryText={this.props.chalkboard.activeName}
                    leftIcon={
                      <i className="icon-user garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Description"
                    secondaryText={this.props.chalkboard.description}
                    leftIcon={
                      <i className="icon-info-circled garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Description')}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Date"
                    secondaryText={this.props.chalkboard.date}
                    leftIcon={
                      <i className="icon-calendar-check-o garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Date')}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Time"
                    secondaryText={this.props.chalkboard.time}
                    leftIcon={
                      <i className="icon-clock garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Time')}
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Location"
                    secondaryText={this.props.chalkboard.location}
                    leftIcon={
                      <i className="icon-location garnett-icon"></i>
                    }
                    onClick={() => this.handleEditOpen('Location')}
                  />
                  <Divider className="garnett-divider last" />
                </List>
              </Tab>
              <Tab style={getTabStyle(this.state.index === 1)} label="Attendees" value={1}>
                <LoadableAttendeeList attendees={this.props.attendees} />
              </Tab>
            </Tabs>
          </Dialog>

          <LoadableEditChalkboardDialog
            open={this.state.open}
            state={this.props.state}
            chalkboard={this.props.chalkboard}
            field={this.state.field}
            handleClose={this.handleEditClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      )
    )
  }
}
