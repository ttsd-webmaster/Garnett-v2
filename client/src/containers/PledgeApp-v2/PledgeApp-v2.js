import 'containers/PledgeApp/PledgeApp.css';
import './PledgeApp-v2.css';
import { loadFirebase } from 'helpers/functions.js';
import {
  LoadableMeritBook,
  LoadableContacts,
} from 'helpers/LoadableComponents';

import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Pledges } from './components/Pledges/Pledges';

const routes = [
  {
    path: '/pledge-app/my-merits',
    exact: true,
    content: props => (
      <div id="content">
        <LoadableMeritBook
          state={props.state}
          handleRequestOpen={props.handleRequestOpen}
        />
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
  loader: () => import('components/MeritBook/PledgeMerit/Dialogs/PledgeMeritDialog'),
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
        let firebase = window.firebase;
        let fullName = this.props.state.displayName;
        let userRef = firebase.database().ref('/users/' + fullName);

        userRef.on('value', (user) => {
          let totalMerits = user.val().totalMerits;

          console.log(`Total Merits: ${totalMerits}`);
          localStorage.setItem('totalMerits', totalMerits);

          userRef.child('Merits').on('value', (snapshot) => {
            let merits = [];

            if (snapshot.val()) {
              merits = Object.keys(snapshot.val()).map(function(key) {
                return snapshot.val()[key];
              }).sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              });
            }

            console.log(`Merit array: ${merits}`);
            localStorage.setItem('meritArray', JSON.stringify(merits));
            localStorage.setItem('totalMerits', totalMerits);

            this.setState({
              totalMerits: totalMerits,
              previousTotalMerits: this.state.totalMerits
            });
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
            user={this.props.state}
            merits={this.state.merits}
            totalMerits={this.state.totalMerits}
            previousTotalMerits={this.state.previousTotalMerits}
            openMerit={this.handleMeritOpen}
            logOut={this.props.logoutCallBack}
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
          {this.props.state.status === 'pledge' && (
            <LoadablePledgeMeritDialog
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
