// @flow

import './Home.css';
import API from 'api/API.js';
import dataApp from './images/dataApp.png';
import delibsApp from './images/delibsApp.png';
import pledgeApp from './images/pledgeApp.png';
import urlApp from './images/urlApp.png';
import { GarnettApp } from './components/GarnettApp';

import React, { PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  logOut: () => void
};

export class Home extends PureComponent<Props> {
  componentDidMount() {
    localStorage.setItem('route', 'home');
  }

  goTo = (route: string) => {
    this.props.history.push(route);
  }

  logOut = () => {
    if (navigator.onLine) {
      API.logOut()
      .then(res => {
        this.props.logOut();
        this.props.history.push('/');
      })
      .catch(err => console.error('err', err));
    } else {
      this.props.logOut();
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <div id="home-container">
        <h1 id="home-header">Welcome to Garnett</h1>
        <div className="icon-container animate-in">
          <GarnettApp
            title="Pledge App"
            src={pledgeApp}
            goTo={() => this.goTo('pledge-app')}
          />
          <GarnettApp
            title="Data App"
            src={dataApp}
            goTo={() => this.goTo('data-app')}
          />
          <GarnettApp
            title="Url App"
            src={urlApp}
            goTo={() => this.goTo('url-app')}
          />
          <GarnettApp
            title="Delibs App"
            src={delibsApp}
            goTo={() => this.goTo('delibs-app')}
          />
        </div>
        <div className="logout-button" onClick={this.logOut}>Log Out</div>
      </div>
    )
  }
}
