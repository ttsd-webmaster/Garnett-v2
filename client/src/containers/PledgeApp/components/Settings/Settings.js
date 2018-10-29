import './Settings.css';
import API from 'api/API.js';
import { LoadingComponent } from 'helpers/loaders.js';

import React, { PureComponent } from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class Settings extends PureComponent {
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
    const {
      name,
      phone,
      email,
      class: className,
      major,
      status,
      photoURL
    } = this.props.state;

    return (
      photoURL ? (
        <div className={`animate-in${this.props.hidden ? " hidden" : ""}`}>
          <img className="user-photo" src={photoURL} alt="User" />
          <List className="garnett-list">
            <Divider />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Name"
              secondaryText={name}
              leftIcon={
                <i className="icon-user garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Phone Number"
              secondaryText={phone}
              leftIcon={
                <i className="icon-phone garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Email Address"
              secondaryText={email}
              leftIcon={
                <i className="icon-mail-alt garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Class"
              secondaryText={className}
              leftIcon={
                <i className="icon-users garnett-icon"></i>
              }
            />
            <Divider inset={true} />
            <ListItem
              className="garnett-list-item settings"
              primaryText="Major"
              secondaryText={major}
              leftIcon={
                <i className="icon-graduation-cap garnett-icon"></i>
              }
            />
            <Divider />
          </List>

          {status !== 'pledge' ? (
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
