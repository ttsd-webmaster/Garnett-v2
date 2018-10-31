import './App.css';
import 'fontello/css/fontello.css';
import API from 'api/API.js';
import {
  isMobileDevice,
  initializeFirebase,
  loadFirebase,
  registerNotificationToken,
  loginCheck
} from 'helpers/functions';
import { 
  Login,
  Home,
  DelibsApp,
  RusheeProfile,
  DataApp,
  PledgeApp,
  MobilePledgeApp
} from 'containers';
import { PublicRoute, PrivateRoute } from 'components/Routes';

import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';

const routes = [
  {
    path: '/home',
    exact: true,
    component: Home
  },
  {
    path: '/pledge-app',
    exact: false,
    component: isMobileDevice() ? MobilePledgeApp : PledgeApp
  },
  {
    path: '/delibs-app',
    exact: true,
    component: DelibsApp
  },
  {
    path: '/delibs-app/:id',
    exact: true,
    component: RusheeProfile
  },
  {
    path: '/data-app',
    exact: true,
    component: DataApp
  }
];

export default class App extends Component {
  state = {
    authenticated: false,
    loading: true,
    open: false,
    message: ''
  }

  componentDidMount() {
    const data = JSON.parse(localStorage.getItem('data'));
    const sw_msg = localStorage.getItem('sw_msg');

    if (sw_msg) {
      localStorage.removeItem('sw_msg');
      setTimeout(() => {
        this.handleRequestOpen(sw_msg);
      }, 2000);
    }

    if (navigator.onLine) {
      if (data !== null) {
        initializeFirebase();

        loadFirebase('auth')
        .then(() => {
          const { firebase } = window;

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              API.getAuthStatus(user.displayName)
              .then((res) => {
                this.loginCallBack(res.data);
              });
            } else {
              this.setState({ loading: false });
            }
          });
        });
      } else {
        this.setState({ loading: false });
      }
    }
    else {
      if (data !== null) {
        this.setData(data);
      } else {
        this.setState({ loading: false });
      }
    }
  }

  loginCallBack = (user) => {
    /* Checks if browser is Safari, iOS version < 11, IE, Edge, or in development */
    if (loginCheck()) {
      this.setData(user);
    } else {
      registerNotificationToken(user, () => this.setState(user));
    }
  }

  setData = (user) => {
    const name = `${user.firstName} ${user.lastName}`;
    let displayName = user.firstName + user.lastName;
    displayName = displayName.replace(/\s/g, '');

    this.setState({
      name,
      displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      class: user.class,
      major: user.major,
      status: user.status,
      photoURL: user.photoURL,
      authenticated: true,
      loading: false
    });
  }

  logoutCallBack = () => {
    localStorage.clear();
    this.setState({
      authenticated: false
    });
  }

  handleRequestOpen = (message) => {
    this.setState({
      message,
      open: true
    });
  }

  handleRequestClose = () => {
    this.setState({ open: false });
  }

  get rootPath() {
    const route = localStorage.getItem('route');
    if (this.state.status === 'pledge') {
      return <Redirect to="/pledge-app" />
    } else {
      switch (route) {
        case 'pledge-app':
          return <Redirect to="/pledge-app" />
        case 'delibs-app':
          return <Redirect to="/delibs-app" />
        case 'data-app':
          return <Redirect to="/data-app" />
        default:
          return <Redirect to="/home" />
      }
    }
  }

  render() {
    const { authenticated, loading } = this.state;

    if (loading) {
      return null;
    }

    return (
      <Router>
        <div>
          <PrivateRoute
            exact
            path="/"
            authenticated={authenticated}
            component={() => this.rootPath}
          />
          <PublicRoute
            exact
            path="/login"
            state={this.state}
            authenticated={authenticated}
            loginCallBack={this.loginCallBack}
            component={Login}
          />
          <Switch>
            {routes.map((route, index) => (
              <PrivateRoute
                key={index}
                exact={route.exact}
                path={route.path}
                state={this.state}
                authenticated={authenticated}
                component={route.component}
                logoutCallBack={this.logoutCallBack}
              />
            ))}
            <Redirect from="/pledge-app" to="/pledge-app/my-merits" />
          </Switch>
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      </Router>
    );
  }
}
