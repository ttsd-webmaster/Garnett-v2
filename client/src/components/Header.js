// @flow

import API from 'api/API.js';

import React, { PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  logOut: () => void,
  title: string
};

export class Header extends PureComponent<Props> {
  goHome = () => {
    this.props.history.push('/home');
  }

  logOut = () => {
    if (navigator.onLine) {
      API.logOut()
      .then(res => {
        console.log(res);
        this.props.logOut();
        this.props.history.push('/');
      })
      .catch(error => console.log(`Error: ${error}`));
    }
    else {
      this.props.logOut();
      this.props.history.push('/');
    }
  }

  render() {
    const { title, logOut } = this.props;
    const onClick = logOut ? this.logOut : this.goHome;
    const backText = logOut ? 'Log out' : 'Home';
    return (
      <div className="app-header">
        <span>{ title }</span>
        <span className="back-button" onClick={onClick}>
          { backText }
        </span>
      </div>
    )
  }
}
