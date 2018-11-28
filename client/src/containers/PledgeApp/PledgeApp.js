import './MobilePledgeApp.css';
import './PledgeApp.css';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Main } from './components/Main/Main';

import React, { PureComponent } from 'react';

export class PledgeApp extends PureComponent {
  componentDidMount() {
    localStorage.setItem('route', 'pledge-app');
  }

  render() {
    return (
      <div id="pledge-app-container">
        <Sidebar
          history={this.props.history}
          user={this.props.state}
          logOut={this.props.logoutCallBack}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <Main
          state={this.props.state}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      </div>
    )
  }
}
