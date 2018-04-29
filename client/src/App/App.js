import './App.css';
import API from '../api/API.js';
import {initializeFirebase, loadFirebase} from '../helpers/functions.js';
import {
  LoadingLogin,
  LoadingHome,
  LoadingPledgeApp,
  LoadingDelibsApp,
  LoadingRusheeProfile
} from '../helpers/loaders.js';

import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import Snackbar from 'material-ui/Snackbar';

const LoadableLogin = Loadable({
  loader: () => import('../containers/Login/Login'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingLogin
});

const LoadableHome = Loadable({
  loader: () => import('../containers/Home/Home'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingHome
});

const LoadablePledgeApp = Loadable({
  loader: () => import('../containers/PledgeApp/PledgeApp'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingPledgeApp
});

const LoadableDelibsApp = Loadable({
  loader: () => import('../containers/DelibsApp/DelibsApp'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingDelibsApp
});

const LoadableRusheeProfile = Loadable({
  loader: () => import('../containers/DelibsApp/RusheeProfile'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingRusheeProfile
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      loaded: false,
      open: false,
      message: ''
    };
  }

  componentWillMount() {
    let data = JSON.parse(localStorage.getItem('data'));
    let firebaseData = JSON.parse(localStorage.getItem('firebaseData'));
    let route = localStorage.getItem('route');

    this.setState({
      route: route
    });

    if (navigator.onLine) {
      if (data !== null) {
        initializeFirebase(firebaseData);

        loadFirebase('auth')
        .then(() => {
          let firebase = window.firebase;

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              API.getAuthStatus(user)
              .then((res) => {
                this.loginCallBack(res.data);
              });
            }
            else {
              this.setState({
                loaded: true
              });
            }
          });
        });
      }
      else {
        this.setState({
          loaded: true
        });
      }
    }
    else {
      if (data !== null) {
        this.setData(data);
      }
      else {
        this.setState({
          loaded: true
        });
      }
    }
  }

  componentDidMount() {
    let sw_msg = localStorage.getItem('sw_msg');

    if (sw_msg) {
      localStorage.removeItem('sw_msg');
      setTimeout(() => {
        this.handleRequestOpen(sw_msg);
      }, 2000);
    }
  }

  loginCallBack = (user) => {
    let displayName = user.firstName + user.lastName;
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari || process.env.NODE_ENV === 'development') {
      this.checkPhoto(user);
    }
    else {
      navigator.serviceWorker.getRegistration(swUrl)
      .then((registration) => {
        loadFirebase('messaging')
        .then(() => {
          let firebase = window.firebase;
          let messaging = firebase.messaging();
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
                  console.log(messageRes);
                  this.checkPhoto(user);
                })
                .catch(err => console.log(err));
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
        let firebase = window.firebase;
        let displayName = user.firstName + user.lastName;
        let storage = firebase.storage().ref(`${displayName}.jpg`);

        storage.getDownloadURL()
        .then((url) => {
          API.setPhoto(displayName, url)
          .then((res) => {
            console.log(res.data)

            this.setData(res.data);
          })
          .catch(err => console.log(err));
        })
        .catch((error) => {
          let storage = firebase.storage.ref(`${displayName}.JPG`);

          storage.getDownloadURL()
          .then((url) => {
            API.setPhoto(displayName, url)
            .then((res) => {
              console.log(res.data)

              this.setData(res.data);
            })
            .catch(err => console.log(err));
          })
          .catch((error) => {
            console.log(error);

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
    this.setState({
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.firstName + user.lastName,
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
      open: true,
      message: message
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={() => (
            this.state.isAuthenticated ? (
              this.state.status === "pledge" || 
              this.state.route === "pledge-app" ? (
                <Redirect to="/pledge-app" />
              ) : (
                this.state.route === "delibs-app" ? (
                  <Redirect to="/delibs-app" />
                ) : (
                  <Redirect to="/home" />
                )
              )
            ) : (
              this.state.loaded ? (
                <LoadableLogin 
                  state={this.state}
                  loginCallBack={this.loginCallBack}
                  handleRequestOpen={this.handleRequestOpen}
                />
              ) : (
                <LoadingLogin />
              )
            )
          )}/>
          <Route exact path="/home" render={({history}) => (
            this.state.isAuthenticated ? (
              <LoadableHome
                state={this.state}
                history={history}
                logoutCallBack={this.logoutCallBack}
              />
            ) : (
              this.state.loaded ? (
                <Redirect to="/" />
              ) : (
                <LoadingLogin />
              )
            )
          )}/>
          <Route exact path="/pledge-app" render={({history}) => (
            this.state.isAuthenticated ? (
              <LoadablePledgeApp 
                state={this.state} 
                history={history}
                logoutCallBack={this.logoutCallBack}
                handleRequestOpen={this.handleRequestOpen}
              />
            ) : (
              this.state.loaded ? (
                <Redirect to="/" />
              ) : (
                <LoadingLogin />
              )
            )
          )}/>
          <Route exact path="/delibs-app" render={({history}) => (
            this.state.isAuthenticated ? (
              <LoadableDelibsApp
                state={this.state} 
                history={history}
                handleRequestOpen={this.handleRequestOpen}
              />
            ) : (
              this.state.loaded ? (
                <Redirect to="/" />
              ) : (
                <LoadingLogin />
              )
            )
          )}/>
          <Route exact path="/delibs-app/:id" render={({history}) => (
            this.state.isAuthenticated ? (
              <LoadableRusheeProfile
                state={this.state} 
                history={history}
                handleRequestOpen={this.handleRequestOpen}
              />
            ) : (
              this.state.loaded ? (
                <Redirect to="/" />
              ) : (
                <LoadingLogin />
              )
            )
          )}/>

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

export default App;
