import './Home.css';
import { Header } from 'components';
import { GarnettApp } from './components/GarnettApp';

import React, { PureComponent } from 'react';

export class Home extends PureComponent {
  componentDidMount() {
    localStorage.setItem('route', 'home');
  }

  goTo = (route) => {
    this.props.history.push('/' + route);
  }

  render() {
    return (
      <div className="loading-container">
        <Header
          title="Home"
          noTabs
          history={this.props.history}
          logoutCallBack={this.props.logoutCallBack}
        />
        <div className="icon-container animate-in">
          <GarnettApp
            title="Pledge App"
            value="pledge-app"
            goTo={() => this.goTo('pledge-app')}
          />
          <GarnettApp
            title="Delibs App"
            value="delibs-app"
            goTo={() => this.goTo('delibs-app')}
          />
          <GarnettApp
            title="Data App"
            value="data-app"
            goTo={() => this.goTo('data-app')}
          />
        </div>
      </div>
    )
  }
}
