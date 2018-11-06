import './Settings.css';
import API from 'api/API.js';
import { LoadingComponent } from 'helpers/loaders.js';

import React, { PureComponent } from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';

const toggleStyle = { right: 30 };


export class Settings extends PureComponent {
  constructor(props) {
    super(props);
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const toggleDarkMode = localStorage.getItem('toggleDarkMode') === 'true';
    this.state = { isDarkMode, toggleDarkMode };
  }

  onDarkToggle = () => {
    const { isDarkMode } = this.state;
    localStorage.setItem('darkMode', !isDarkMode);
    document.body.classList.toggle('dark-mode');
    this.setState({ isDarkMode: !isDarkMode });
  }

  onAutoToggle = () => {
    const { toggleDarkMode } = this.state;
    localStorage.setItem('toggleDarkMode', !toggleDarkMode);
    this.setState({ toggleDarkMode: !toggleDarkMode });
  }

  goHome = () => {
    document.body.classList.remove('dark-mode');
    this.props.history.push('/home');
  }
  
  logout = () => {
    document.body.classList.remove('dark-mode');
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

    if (!photoURL) {
      return <LoadingComponent />
    }

    return (
      <div className={`animate-in${this.props.hidden ? " hidden" : ""}`}>
        <img className="user-photo" src={photoURL} alt="User" />
        <List className="garnett-list my-info">
          <Divider className="garnett-divider" />
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Name</p>}
            secondaryText={<p className="garnett-description">{name}</p>}
            leftIcon={<i className="icon-user garnett-icon"></i>}
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Phone Number</p>}
            secondaryText={<p className="garnett-description">{phone}</p>}
            leftIcon={<i className="icon-phone garnett-icon"></i>}
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Email Address</p>}
            secondaryText={<p className="garnett-description">{email}</p>}
            leftIcon={<i className="icon-mail-alt garnett-icon"></i>}
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Class</p>}
            secondaryText={<p className="garnett-description">{className}</p>}
            leftIcon={<i className="icon-users garnett-icon"></i>}
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Major</p>}
            secondaryText={<p className="garnett-description">{major}</p>}
            leftIcon={<i className="icon-graduation-cap garnett-icon"></i>}
          />
          <Divider className="garnett-divider" />
        </List>

        <List className="garnett-list">
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Dark theme</p>}
            secondaryText={
              <p className="garnett-description">
                Enable dark theme throughout the app
              </p>
            }
            rightIcon={
              <Toggle  style={toggleStyle} toggled={this.state.isDarkMode} />
            }
            onClick={this.onDarkToggle}
          />
          <Divider className="garnett-divider" />
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Auto toggle dark theme</p>}
            secondaryText={
              <p className="garnett-description">
                Toggle dark theme on from 6PM to 6AM
              </p>
            }
            rightIcon={
              <Toggle  style={toggleStyle} toggled={this.state.toggleDarkMode} />
            }
            onClick={this.onAutoToggle}
          />
        </List>

        {status !== 'pledge' ? (
          <span className="logout-button" onClick={this.goHome}> Back Home </span>
        ) : (
          <div className="logout-button" onClick={this.logout}> Log Out </div>
        )}
      </div>
    )
  }
}
