// @flow

import API from 'api/API.js';

import React, { PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  logoutCallBack: () => void,
  noTabs: boolean,
  title: string
};

export class Header extends PureComponent<Props> {
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
      .catch(error => console.log(`Error: ${error}`));
    }
    else {
      this.props.logoutCallBack();
      this.props.history.push('/');
    }
  }

  render() {
    const { noTabs, title, logoutCallBack } = this.props;
    const onClick = logoutCallBack ? this.logout : this.goHome;
    const backText = logoutCallBack ? 'Log out' : 'Home';
    return (
      <div className={`app-header${noTabs ? " no-tabs" : ""}`}>
        <span>{ title }</span>
        <span className="back-button" onClick={onClick}>
          { backText }
        </span>
      </div>
    )
  }
}
