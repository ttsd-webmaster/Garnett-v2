import 'containers/PledgeApp/PledgeApp.css';
import './PledgeApp-v2.css';
import { loadFirebase } from 'helpers/functions.js';
import {
  LoadableContacts,
} from 'helpers/LoadableComponents';

import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { MyMerits } from './components/MyMerits/MyMerits';
import { Pledges } from './components/Pledges/Pledges';

const routes = [
  {
    path: '/pledge-app/my-merits',
    exact: true,
    content: props => (
      <div id="content">
        <MyMerits state={props.state} />
      </div>
    )
  },
  {
    path: '/pledge-app/pledge-brothers',
    exact: true,
    content: props => (
      <div id="content">
        <Pledges state={props.state} />
      </div>
    )
  },
  {
    path: '/pledge-app/brothers',
    exact: true,
    content: props => (
      <div id="content">
        <LoadableContacts state={props.state} />
      </div>
    )
  }
];

const LoadablePledgeMeritDialog = Loadable({
  loader: () => import('./components/Dialogs/PledgeMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

const LoadableActiveMeritDialog = Loadable({
  loader: () => import('./components/Dialogs/ActiveMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

export class PledgeApp2 extends Component {
  state = {
    totalMerits: 0,
    previousTotalMerits: 0,
    openMerit: false
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const { displayName } = this.props.state;
        const userRef = firebase.database().ref('/users/' + displayName);

        userRef.on('value', (user) => {
          const { totalMerits } = user.val();

          console.log(`Total Merits: ${totalMerits}`);
          localStorage.setItem('totalMerits', totalMerits);

          this.setState({
            totalMerits: totalMerits,
            previousTotalMerits: this.state.totalMerits
          });
        });
      });
    }
  }

  handleMeritOpen = () => {
    if (navigator.onLine) {
      this.setState({
        openMerit: true
      });

      // Handles android back button
      if (/android/i.test(navigator.userAgent)) {
        let path;
        if (process.env.NODE_ENV === 'development') {
          path = 'http://localhost:3000';
        }
        else {
          path = 'https://garnett-app.herokuapp.com';
        }

        window.history.pushState(null, null, path + window.location.pathname);
        window.onpopstate = () => {
          this.handleMeritClose();
        }
      }
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({
      openMerit: false
    });
  }

  render() {
    return (
      <Router>
        <div id="pledge-app-container">
          <Navbar
            history={this.props.history}
            user={this.props.state}
            merits={this.state.merits}
            totalMerits={this.state.totalMerits}
            previousTotalMerits={this.state.previousTotalMerits}
            openMerit={this.handleMeritOpen}
            logOut={this.props.logoutCallBack}
            handleRequestOpen={this.props.handleRequestOpen}
          />
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                exact={route.exact}
                path={route.path}
                render={() => route.content(this.props)}
              />
            ))}
            <Redirect from="/pledge-app" to="/pledge-app/my-merits" />
          </Switch>
          {this.props.state.status === 'pledge' ? (
            <LoadablePledgeMeritDialog
              open={this.state.openMerit}
              state={this.props.state}
              handleMeritClose={this.handleMeritClose}
              handleRequestOpen={this.props.handleRequestOpen}
            />
          ) : (
            <LoadableActiveMeritDialog
              open={this.state.openMerit}
              state={this.props.state}
              handleMeritClose={this.handleMeritClose}
              handleRequestOpen={this.props.handleRequestOpen}
            />
          )}
        </div>
      </Router>
    )
  }
}
