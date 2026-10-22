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
  PledgeApp,
  UrlApp
} from 'containers';
import { PublicRoute, PrivateRoute } from 'components/Routes';
import ScrollToTop from 'components/ScrollToTop';
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
  },
  {
    path:'/url-app',
    exact: true,
    component: UrlApp
  }
];

// TODO: use React Context instead of State
type State = {
  user: User,
  authenticated: boolean,
  loading: boolean,
  open: boolean,
  message: string
};

export default class App extends Component<{}, State> {
  state = {
    user: null,
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

    // Show the app straight away from the cached user. Waiting on Firebase,
    // the server, and notifications first kept the page blank, and forever if
    // any of them failed.
    this.setData(data);

    if (!navigator.onLine) {
      return;
    }

    // Then confirm the session and refresh the user in the background
    initializeFirebase()
    .then(() => loadFirebase('auth'))
    .then(() => {
      const { firebase } = window;

      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          this.setState({ user: null, authenticated: false });
          return;
        }

        API.getAuthStatus(user.displayName)
        .then((res) => {
          if (res.data) {
            this.loginCallback(res.data);
          } else {
            this.setState({ user: null, authenticated: false });
          }
        })
        .catch((error) => console.error(error));
      });
    })
    .catch((error) => console.error(error));
  }

  loginCallback = (user: User) => {
    // Keep the cached copy current so the next launch starts from it
    localStorage.setItem('data', JSON.stringify(user));
    this.setData(user);

    // Notifications are set up after the app shows, never before
    if (browserSupportsNotifications()) {
      registerNotificationToken(user)
      .catch((error) => {
        this.handleRequestOpen(error.message);
      });
    }
  }

  setData(fetchedUser: User) {
    const { firstName, lastName } = fetchedUser;
    const name = `${firstName} ${lastName}`;
    const displayName = (firstName + lastName).replace(/\s/g, '');
    const user = {
      name,
      displayName,
      firstName,
      lastName,
      phone: fetchedUser.phone,
      email: fetchedUser.email,
      class: fetchedUser.class,
      major: fetchedUser.major,
      status: fetchedUser.status,
      photoURL: fetchedUser.photoURL
    };

    this.setState({
      user,
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

  render() {
    const { user, authenticated, loading, open, message } = this.state;

    if (loading) {
      return null;
    }

    return (
      <Router>
        <ScrollToTop />
        {/* Pages fetch once on mount, so remount them if the background
            check finds the cached user is out of date (e.g. renamed to PI) */}
        <div key={user ? `${user.displayName}-${user.status}` : 'signed-out'}>
          <Switch>
            <PrivateRoute
              exact
              path="/"
              state={user}
              authenticated={authenticated}
              component={() => this.rootPath}
            />
            <PublicRoute
              exact
              path="/login"
              state={user}
              authenticated={authenticated}
              loginCallback={this.loginCallback}
              handleRequestOpen={this.handleRequestOpen}
              component={Login}
            />
            {routes.map((route, index) => (
              <PrivateRoute
                key={index}
                exact={route.exact}
                path={route.path}
                state={user}
                authenticated={authenticated}
                component={route.component}
                logOut={this.logoutCallBack}
                handleRequestOpen={this.handleRequestOpen}
              />
            ))}
            <Redirect from="/pledge-app" to="/pledge-app/my-merits" />
          </Switch>
          <Snackbar
            open={open}
            message={message}
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
