import './App.css';
import 'fontello/css/fontello.css';
import API from 'api/API.js';
import { initializeFirebase, loadFirebase, iOSversion } from 'helpers/functions';
import { LoadingLogin } from 'helpers/loaders'
import {
  LoadableLogin,
  LoadableHome,
  LoadablePledgeApp,
  LoadableDelibsApp,
  LoadableRusheeProfile,
  LoadableDataApp
} from 'helpers/LoadableComponents';
import { PledgeApp2 } from 'containers/PledgeApp-v2/PledgeApp-v2'

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';

export default class App extends Component {
  state = {
    isAuthenticated: false,
    loaded: false,
    open: false,
    message: ''
  }

  componentDidMount() {
    const data = JSON.parse(localStorage.getItem('data'));
    const firebaseData = JSON.parse(localStorage.getItem('firebaseData'));
    const sw_msg = localStorage.getItem('sw_msg');

    if (sw_msg) {
      localStorage.removeItem('sw_msg');
      setTimeout(() => {
        this.handleRequestOpen(sw_msg);
      }, 2000);
    }

    if (navigator.onLine) {
      if (data !== null) {
        initializeFirebase(firebaseData);

        loadFirebase('auth')
        .then(() => {
          const { firebase } = window;

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              API.getAuthStatus(user.displayName)
              .then((res) => {
                this.loginCallBack(res.data);
              });
            }
            else {
              this.setState({ loaded: true });
            }
          });
        });
      }
      else {
        this.setState({ loaded: true });
      }
    }
    else {
      if (data !== null) {
        this.setData(data);
      }
      else {
        this.setState({ loaded: true });
      }
    }
  }

  loginCallBack = (user) => {
    const displayName = user.firstName + user.lastName;
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    /* Checks if browser is Safari, iOS version < 11, IE, Edge, or in development */
    if (isSafari || iOSversion()[0] < 11 || document.documentMode ||
        /Edge/.test(navigator.userAgent) || process.env.NODE_ENV === 'development') {
      this.checkPhoto(user);
    }
    else {
      navigator.serviceWorker.getRegistration(swUrl)
      .then((registration) => {
        loadFirebase('messaging')
        .then(() => {
          const { firebase } = window;
          const messaging = firebase.messaging();
          messaging.useServiceWorker(registration);

          messaging.requestPermission()
          .then(() => {
            console.log('Notification permission granted.');
            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            messaging.getToken()
            .then((currentToken) => {
              if (currentToken) {
                localStorage.setItem('registrationToken', currentToken);

                API.saveMessagingToken(displayName, currentToken)
                .then(messageRes => {
                  this.checkPhoto(user);
                })
                .catch(error => console.log(`Error: ${error}`));
              } 
              else {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');
                this.checkPhoto(user);
              }
            })
            .catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
              this.checkPhoto(user);
            });
          })
          .catch((err) => {
            console.log('Unable to get permission to notify.', err);
            this.checkPhoto(user);
          });
        });
      });
    }
  }

  checkPhoto = (user) => {
    const defaultPhoto = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png';

    if (user.photoURL === defaultPhoto && user.status !== 'alumni') {
      loadFirebase('storage')
      .then(() => {
        const { firebase } = window;
        let displayName = user.firstName + user.lastName;
        displayName = displayName.replace(/\s/g, '');
        const storage = firebase.storage().ref(`${displayName}.jpg`);

        storage.getDownloadURL()
        .then((url) => {
          API.updatePhoto(displayName, url)
          .then((res) => {
            console.log(res.data);

            this.setData(res.data);
          })
          .catch((error) => {
            console.log(`Error: ${error}`);

            this.setData(user);
          });
        })
        .catch((error) => {
          const storage = firebase.storage().ref(`${displayName}.JPG`);

          storage.getDownloadURL()
          .then((url) => {
            API.updatePhoto(displayName, url)
            .then((res) => {
              console.log(res.data);

              this.setData(res.data);
            })
            .catch(error => console.log(`Error: ${error}`));
          })
          .catch((error) => {
            console.log(`Error: ${error}`);

            this.setData(user);
          });
        });
      });
    }
    else {
      this.setData(user);
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
      isAuthenticated: true
    });
  }

  logoutCallBack = () => {
    localStorage.clear();

    this.setState({
      isAuthenticated: false,
      loaded: true
    });
  }

  handleRequestOpen = (message) => {
    this.setState({
      message,
      open: true,
    });
  }

  handleRequestClose = () => {
    this.setState({ open: false });
  }

  get rootPath() {
    const route = localStorage.getItem('route');
    if (this.state.isAuthenticated) {
      if (this.state.status === 'pledge') {
        return <Redirect to="/pledge-app" />
      }
      else {
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
    else if (this.state.loaded) {
      return (
        <LoadableLogin 
          state={this.state}
          loginCallBack={this.loginCallBack}
          handleRequestOpen={this.handleRequestOpen}
        />
      )
    }
    else {
      return (
        <LoadingLogin />
      )
    }
  }

  homePath(history) {
    if (this.state.isAuthenticated) {
      return (
        <LoadableHome
          state={this.state}
          history={history}
          logoutCallBack={this.logoutCallBack}
        />
      )
    }
    else if (this.state.loaded) {
      return <Redirect to="/" />
    }
    else {
      return <LoadingLogin />
    }
  }

  pledgeAppPath(history) {
    if (this.state.isAuthenticated) {
      if (window.innerWidth > 768) {
        return (
          <PledgeApp2 
            state={this.state}
            history={history}
            logoutCallBack={this.logoutCallBack}
            handleRequestOpen={this.handleRequestOpen}
          />
        )
      }
      else {
        return (
          <LoadablePledgeApp 
            state={this.state}
            history={history}
            logoutCallBack={this.logoutCallBack}
            handleRequestOpen={this.handleRequestOpen}
          />
        )
      }
    }
    else if (this.state.loaded) {
      return <Redirect to="/" />
    }
    else {
      return <LoadingLogin />
    }
  }

  delibsAppPath(history) {
    if (this.state.isAuthenticated) {
      return (
        <LoadableDelibsApp
          state={this.state}
          history={history}
          handleRequestOpen={this.handleRequestOpen}
        />
      )
    }
    else if (this.state.loaded) {
      return <Redirect to="/" />
    }
    else {
      return <LoadingLogin />
    }
  }

  rusheeProfilePath(history) {
    if (this.state.isAuthenticated) {
      return (
        <LoadableRusheeProfile
          state={this.state}
          history={history}
          handleRequestOpen={this.handleRequestOpen}
        />
      )
    }
    else if (this.state.loaded) {
      return <Redirect to="/" />
    }
    else {
      return <LoadingLogin />
    }
  }

  dataAppPath(history) {
    if (this.state.isAuthenticated) {
      return (
        <LoadableDataApp
          state={this.state}
          history={history}
          handleRequestOpen={this.handleRequestOpen}
        />
      )
    }
    else if (this.state.loaded) {
      return <Redirect to="/" />
    }
    else {
      return <LoadingLogin />
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Route
            exact
            path="/"
            render={() => this.rootPath}
          />
          <Route
            exact
            path="/home"
            render={({ history }) => this.homePath(history)}
          />
          <Route
            path="/pledge-app"
            render={({ history }) => this.pledgeAppPath(history)}
          />
          <Route
            exact
            path="/delibs-app"
            render={({ history }) => this.delibsAppPath(history)}
          />
          <Route
            exact
            path="/delibs-app/:id"
            render={({ history }) => this.rusheeProfilePath(history)}
          />
          <Route
            exact
            path="/data-app"
            render={({ history }) => this.dataAppPath(history)}
          />
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
