import './Settings.css';
import API from '../../api/API.js';
import {LoadingComponent} from '../../helpers/loaders.js';

import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listItemStyle = {
  backgroundColor: '#fff',
  zIndex: -1
};

const dividerStyle = {
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px'
};

export default class Settings extends Component {
  logout = () => {
    if (navigator.onLine) {
      API.logout()
      .then(res => {
        console.log(res);
        this.props.logoutCallBack();
        this.props.history.push('/');
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.logoutCallBack();
      this.props.history.push('/');
    }
  }

  render() {
    return (
      this.props.state.photoURL ? (
        <div>
          <img className="user-photo" src={this.props.state.photoURL} alt="User" />
          <List>
            <Divider />
            <ListItem
              innerDivStyle={listItemStyle}
              primaryText="Name"
              secondaryText={this.props.state.name}
              leftIcon={
                <i className="icon-user garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              innerDivStyle={listItemStyle}
              primaryText="Phone Number"
              secondaryText={this.props.state.phone}
              leftIcon={
                <i className="icon-phone garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              innerDivStyle={listItemStyle}
              primaryText="Email Address"
              secondaryText={this.props.state.email}
              leftIcon={
                <i className="icon-mail-alt garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              innerDivStyle={listItemStyle}
              primaryText="Class"
              secondaryText={this.props.state.class}
              leftIcon={
                <i className="icon-users garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              innerDivStyle={listItemStyle}
              primaryText="Major"
              secondaryText={this.props.state.major}
              leftIcon={
                <i className="icon-graduation-cap garnett-icon"></i>
              }
            />
            <Divider style={dividerStyle} />
          </List>

          {this.props.state.status !== 'pledge' ? (
            <a className="logout-button" href="/"> Back Home </a>
          ) : (
            <div className="logout-button" onClick={this.logout}> Log Out </div>
          )}
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}