import './Chalkboards.css';
import API from '../../api/API.js';
import {mapsSelector, getTabStyle} from '../../helpers/functions.js';

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
  bottom: 'auto',
  marginTop: '46px',
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
      chalkboard: null,
      open: false,
      field: '',
      index: 0
    };
  }

  onBackButton = (event) => {
    if (event.keyCode == 27) {
      event.preventDefault();
      this.handleClose();
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onBackButton);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onBackButton);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      chalkboard: nextProps.chalkboard
    });
  }

  // Joins the chalkboard
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

  // Removes the chalkboard
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

  // Leaves the chalkboard
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

  // Updates the chalkboard information displayed
  updateChalkboardInfo = () => {
    API.getChalkboardInfo(this.state.chalkboard.title)
    .then((res) => {
      this.setState({
        chalkboard: res.data.chalkboard
      });
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  }

  // Updates the bottom navigation tab index
  handleChange = (value) => {
    this.setState({
      index: value
    });
  }

  // Opens the edit dialog if user is hosting chalkboard
  handleEditOpen = () => {
    this.setState({
      open: true,
    });
  }

  // Closes the edit dialog
  handleEditClose = () => {
    this.setState({
      open: false,
      field: ''
    });
  }

  // Closes this dialog
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
              this.join(this.state.chalkboard);
            }
            else if (this.props.type === 'attending') {
              this.leave(this.state.chalkboard);
            }
            else {
              this.remove(this.state.chalkboard);
            }
          }}
        />
      ),
    ];

    return (
      this.state.chalkboard && (
        <div>
          <Dialog
            title={this.props.type === 'hosting' ? (
              <div>
                {this.state.chalkboard.title}
                <i 
                  className="icon-edit edit-chalkboard"
                  onClick={this.handleEditOpen}
                >
                </i>
              </div>
            ) : (
              this.state.chalkboard.title
            )}
            titleClassName={this.props.type === 'hosting' ? (
              "garnett-dialog-title hosting" 
            ) : (
              "garnett-dialog-title"
            )}
            actions={actions}
            modal={false}
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
                <List style={{padding:'24px 0'}}>
                  <Divider />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Active Name"
                    secondaryText={this.state.chalkboard.activeName}
                    leftIcon={
                      <i className="icon-user garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Description"
                    secondaryText={this.state.chalkboard.description}
                    leftIcon={
                      <i className="icon-info-circled garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Date"
                    secondaryText={this.state.chalkboard.date}
                    leftIcon={
                      <i className="icon-calendar-check-o garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Time"
                    secondaryText={this.state.chalkboard.time}
                    leftIcon={
                      <i className="icon-clock garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText="Location"
                    secondaryText={this.state.chalkboard.location}
                    leftIcon={
                      <i className="icon-location garnett-icon"></i>
                    }
                    onClick={() => {
                      mapsSelector(this.state.chalkboard.location);
                    }}
                  />
                  <Divider className="garnett-divider last" />
                </List>
              </Tab>
              <Tab style={getTabStyle(this.state.index === 1)} label="Attendees" value={1}>
                <LoadableAttendeeList chalkboard={this.state.chalkboard} />
              </Tab>
            </Tabs>
          </Dialog>

          <LoadableEditChalkboardDialog
            open={this.state.open}
            state={this.props.state}
            chalkboard={this.state.chalkboard}
            updateChalkboardInfo={this.updateChalkboardInfo}
            handleClose={this.handleEditClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      )
    )
  }
}
