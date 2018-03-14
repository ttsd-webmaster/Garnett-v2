import './Home.css';
import API from '../../api/API.js';

import React, {Component} from 'react';

export default class Home extends Component {
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
      <div className="loading-container">
        <div className="app-header">
          <span> Home </span>
          <span className="log-out" onClick={this.logout}> Log Out </span>
        </div>
        <div className="icon-container">
          <a className="app-icon" href="/pledge-app">
            <img className="app-icon-image" src={require('./images/pledge-app-icon.png')} />
            <p> Pledge App </p>
          </a>
          <a className="app-icon" href="/delibs-app">
            <img className="app-icon-image" src={require('./images/delibs-icon.png')} />
            <p> Delibs App </p>
          </a>
        </div>
      </div>
    )
  }
}
