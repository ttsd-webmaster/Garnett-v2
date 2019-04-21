// @flow

import './Home.css';
import dataApp from './images/dataApp.png';
import delibsApp from './images/delibsApp.png';
import pledgeApp from './images/pledgeApp.png';
import { Header } from 'components';
import { GarnettApp } from './components/GarnettApp';

import React, { PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  logoutCallBack: () => void
};

export class Home extends PureComponent<Props> {
  componentDidMount() {
    localStorage.setItem('route', 'home');
  }

  goTo = (route: string) => {
    this.props.history.push(route);
  }

  render() {
    return (
      <div className="loading-container">
        <Header
          title="Home"
          history={this.props.history}
          logoutCallBack={this.props.logoutCallBack}
        />
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
            title="Delibs App"
            src={delibsApp}
            goTo={() => this.goTo('delibs-app')}
          />
        </div>
      </div>
    )
  }
}
