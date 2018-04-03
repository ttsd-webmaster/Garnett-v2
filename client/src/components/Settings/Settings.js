import './Settings.css';
import API from '../../api/API.js';
import {LoadingComponent} from '../../helpers/loaders.js';

import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class Settings extends Component {
  goHome = () => {
    this.props.history.push('/home');
  }
  
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
          <List className="garnett-list">
            <Divider />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Name"
              secondaryText={this.props.state.name}
              leftIcon={
                <i className="icon-user garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Phone Number"
              secondaryText={this.props.state.phone}
              leftIcon={
                <i className="icon-phone garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Email Address"
              secondaryText={this.props.state.email}
              leftIcon={
                <i className="icon-mail-alt garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Class"
              secondaryText={this.props.state.class}
              leftIcon={
                <i className="icon-users garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Major"
              secondaryText={this.props.state.major}
              leftIcon={
                <i className="icon-graduation-cap garnett-icon"></i>
              }
            />
            <Divider />
          </List>

          {this.props.state.status !== 'pledge' ? (
            <span className="logout-button" onClick={this.goHome}> Back Home </span>
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