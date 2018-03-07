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

const dividerStyle = {
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px'
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

export default class HandleChalkboardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        onClick={this.props.handleClose}
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
        <Dialog
          title={this.props.chalkboard.title}
          titleClassName="garnett-dialog-title"
          actions={actions}
          modal={false}
          className="garnett-dialog"
          bodyClassName="garnett-dialog-body"
          contentClassName="garnett-dialog-content"
          open={this.props.open}
          onRequestClose={this.props.handleClose}
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
                />
                <Divider className="pledge-divider" />
                <ListItem
                  innerDivStyle={listItemStyle}
                  primaryText="Description"
                  secondaryText={this.props.chalkboard.description}
                />
                <Divider className="pledge-divider" />
                <ListItem
                  innerDivStyle={listItemStyle}
                  primaryText="Date"
                  secondaryText={this.props.chalkboard.date}
                />
                <Divider className="pledge-divider" />
                <ListItem
                  innerDivStyle={listItemStyle}
                  primaryText="Time"
                  secondaryText={this.props.chalkboard.time}
                />
                <Divider className="pledge-divider" />
                <ListItem
                  innerDivStyle={listItemStyle}
                  primaryText="Location"
                  secondaryText={this.props.chalkboard.location}
                />
                <Divider style={dividerStyle} />
              </List>
            </Tab>
            <Tab style={getTabStyle(this.state.index === 1)} label="Attendees" value={1}>
              <LoadableAttendeeList attendees={this.props.attendees} />
            </Tab>
          </Tabs>
        </Dialog>
      )
    )
  }
}
