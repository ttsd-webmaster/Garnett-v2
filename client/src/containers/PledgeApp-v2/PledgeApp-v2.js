import 'containers/PledgeApp/PledgeApp.css';
import './PledgeApp-v2.css';
import { loadFirebase } from 'helpers/functions.js';
import { LoadableContacts } from 'helpers/LoadableComponents';
import { LoadablePledgeMeritDialog, LoadableActiveMeritDialog } from './components/Dialogs';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { MyMerits } from './components/MyMerits/MyMerits';
import { Pledges } from './components/Pledges/Pledges';

const routes = [
  {
    path: '/pledge-app/my-merits',
    exact: true,
    content: props => <MyMerits state={props.state} />
  },
  {
    path: '/pledge-app/pledge-brothers',
    exact: true,
    content: props => <Pledges state={props.state} />
  },
  {
    path: '/pledge-app/brothers',
    exact: true,
    content: props => <LoadableContacts state={props.state} />
  }
];

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
          <div id="content">
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
          </div>
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
