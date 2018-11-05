import API from 'api/API.js';

import React, { PureComponent } from 'react';

export class Header extends PureComponent {
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
    return (
      <div className={`app-header${this.props.noTabs ? " no-tabs" : ""}`}>
        <span>{this.props.title}</span>
        {this.props.logoutCallBack ? (
          <span className="back-button" onClick={this.logout}>Log Out</span>
        ) : (
          <span className="back-button" onClick={this.goHome}>Home</span>
        )}
      </div>
    )
  }
}
