// @flow

import './App.css';
import 'fontello/css/fontello.css';
import API from 'api/API';
import {
  initializeFirebase,
  loadFirebase,
  registerNotificationToken,
  browserSupportsNotifications
} from 'helpers/functions';
import { 
  Login,
  Home,
  DelibsApp,
  RusheeProfile,
  DataApp,
  PledgeApp
} from 'containers';
import { PublicRoute, PrivateRoute } from 'components/Routes';
import type { User } from 'api/models';

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
    component: PledgeApp
  },
  {
    path: '/data-app',
    exact: true,
    component: DataApp
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
  }
];

// TODO: use React Context instead of State
type State = {
  name: string,
  displayName: string,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  class: string,
  major: string,
  status: string,
  photoURL: string,
  authenticated: boolean,
  loading: boolean,
  open: boolean,
  message: string
};

export default class App extends Component<{}, State> {
  state = {
    name: '',
    displayName: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    class: '',
    major: '',
    status: '',
    photoURL: '',
    authenticated: false,
    loading: true,
    open: false,
    message: ''
  };

  componentDidMount() {
    const storedData = localStorage.getItem('data')
    const data = storedData ? JSON.parse(storedData) : null;
    const sw_msg = localStorage.getItem('sw_msg');

    // Show snackbar message if there is one
    if (sw_msg) {
      localStorage.removeItem('sw_msg');
      setTimeout(() => {
        this.handleRequestOpen(sw_msg);
      }, 2000);
    }

    // Check if there is user data cached
    if (!data) {
      this.setState({ loading: false });
      return;
    }

    // Check if we are online
    if (!navigator.onLine) {
      this.setData(data);
      return;
    }

    initializeFirebase();

    loadFirebase('auth')
    .then(() => {
      const { firebase } = window;

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          API.getAuthStatus(user.displayName)
          .then((res) => {
            const userData = res.data;
            this.loginCallback(userData);
          });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  }

  loginCallback = (user: User) => {
    if (browserSupportsNotifications()) {
      registerNotificationToken(user)
      .then((res) => {
        this.loadDatabase(user);
      })
      .catch((error) => {
        this.loadDatabase(user);
        this.handleRequestOpen(error.message);
      })
    } else {
      this.loadDatabase(user);
    }
  }

  loadDatabase(user: User) {
    if (window.firebase.database) {
      this.setData(user);
    } else {
      loadFirebase('database')
      .then(() => this.setData(user));
    }
  }

  setData(user: User) {
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
    document.body.classList.remove('dark-mode');
    this.setState({ authenticated: false });
  }

  handleRequestOpen = (message: string) => {
    this.setState({ message, open: true });
  }

  handleRequestClose = () => this.setState({ open: false });

  get rootPath() {
    const route = localStorage.getItem('route');
    if (this.state.status === 'pledge') {
      return <Redirect to="/pledge-app" />;
    } else {
      switch (route) {
        case 'pledge-app':
          return <Redirect to="/pledge-app" />;
        case 'data-app':
          return <Redirect to="/data-app" />;
        case 'delibs-app':
          return <Redirect to="/delibs-app" />;
        default:
          return <Redirect to="/home" />;
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
            loginCallback={this.loginCallback}
            handleRequestOpen={this.handleRequestOpen}
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
                handleRequestOpen={this.handleRequestOpen}
              />
            ))}
            <Redirect from="/pledge-app" to="/pledge-app/my-merits" />
          </Switch>
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            action="Close"
            autoHideDuration={4000}
            onActionClick={this.handleRequestClose}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      </Router>
    );
  }
}
