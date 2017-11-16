import './Settings.css';

import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import API from '../../api/API.js';

const listStyle = {
  textAlign: 'left',
};

const listItemStyle = {
  backgroundColor: '#fff',
  zIndex: -1
};

const dividerStyle = {
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px'
};

export default class Settings extends Component {
  logout = () => {
    API.logout()
    .then(res => {
      console.log(res);
      this.props.logoutCallBack();
      this.props.history.push('/');
    })
    .catch(err => console.log('err', err));
  }

  render() {
    return (
      <div>
        <img className="user-photo" src={this.props.state.photoURL} alt="User" />
        <List style={listStyle}>
          <Divider />
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText="Name"
            secondaryText={this.props.state.name}
            leftIcon={
              <i className="icon-user settings-icon"></i>
            }
          />
          <Divider inset={true} />
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText="Phone Number"
            secondaryText={this.props.state.phone}
            leftIcon={
              <i className="icon-phone settings-icon"></i>
            }
          />
          <Divider inset={true} />
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText="Email Address"
            secondaryText={this.props.state.email}
            leftIcon={
              <i className="icon-mail-alt settings-icon"></i>
            }
          />
          <Divider inset={true} />
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText="Class"
            secondaryText={this.props.state.class}
            leftIcon={
              <i className="icon-users settings-icon"></i>
            }
          />
          <Divider inset={true} />
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText="Major"
            secondaryText={this.props.state.major}
            leftIcon={
              <i className="icon-briefcase settings-icon"></i>
            }
          />
          <Divider style={dividerStyle} />
        </List>
        <br />
        <div className="logout-button" onClick={this.logout}> Log Out </div>
        <br />
      </div>
    )
  }
}