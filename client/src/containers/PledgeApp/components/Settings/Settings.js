import './Settings.css';
import API from 'api/API.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { UserInfo } from 'components';
import { ThemeOptions } from './components';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';

export class Settings extends PureComponent {
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

    if (this.props.hidden) {
      return null;
    }

    if (!photoURL) {
      return <LoadingComponent />
    }

    return (
      <div className="animate-in">
        <List className="garnett-list">
          <UserInfo
            photoURL={photoURL}
            name={name}
            phone={phone}
            email={email}
            className={className}
            major={major}
          />
        </List>
        <ThemeOptions />
        {status === 'pledge' ? (
          <div className="logout-button" onClick={this.logout}> Log Out </div>
        ) : (
          <span className="logout-button" onClick={this.goHome}> Back Home </span>
        )}
      </div>
    )
  }
}
