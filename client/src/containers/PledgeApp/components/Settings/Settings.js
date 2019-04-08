// @flow

import './Settings.css';
import API from 'api/API.js';
import { isMobile } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders.js';
import { UserInfo } from 'components';
import { ThemeOptions } from './components';
import type { User } from 'api/models';

import React, { Fragment, PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  state: User,
  logoutCallBack: () => void
};

export class Settings extends PureComponent<Props> {
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
      <div className="animate-in">
        <UserInfo
          photoURL={photoURL}
          name={name}
          phone={phone}
          email={email}
          className={className}
          major={major}
        />
        {isMobile() && (
          <Fragment>
            <ThemeOptions />
            {status === 'pledge' ? (
              <div className="logout-button" onClick={this.logout}> Log Out </div>
            ) : (
              <span className="logout-button" onClick={this.goHome}> Back Home </span>
            )}
          </Fragment>
        )}
      </div>
    )
  }
}
