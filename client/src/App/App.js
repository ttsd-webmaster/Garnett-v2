import './App.css';
import '../fontello/css/fontello.css';
import API from '../api/API.js';
import loadFirebase from '../helpers/loadFirebase.js';

import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

function Loading() {
  return (
    <div className="loading">
      <div className="loading-image"></div>
    </div>
  )
}

const LoadableLogin = Loadable({
  loader: () => import('../containers/Login/Login'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading: Loading
});

const LoadablePledgeApp = Loadable({
  loader: () => import('../containers/PledgeApp/PledgeApp'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading: Loading
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      isAuthenticated: false,
      loaded: false
    };
  }

  componentDidMount() {
    let token = localStorage.getItem('token');
    let firebaseData = JSON.parse(localStorage.getItem('firebaseData'));
    let firebase;

    if (navigator.onLine) {
      if (token !== null) {
        loadFirebase('app')
        .then(() => {
          firebase = window.firebase;

          if (!firebase.apps.length) {
            firebase.initializeApp(firebaseData);
          }

          loadFirebase('auth')
          .then(() => {
            firebase = window.firebase;

            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                API.getAuthStatus(user)
                .then(res => {
                  this.loginCallBack(res);
                  this.setState({
                    isAuthenticated: true
                  });
                });
              }
              else {
                this.setState({
                  loaded: true
                })
              }
            });
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
      let data = JSON.parse(localStorage.getItem('data'));

      if (token !== null) {
        this.loginCallBack(data);
      }
      else {
        this.setState({
          loaded: true
        });
      }
    }
  }

  toggleSignState = () => {
    this.setState({
      staySigned: !this.state.staySigned
    });
  }

  loginCallBack = (res) => {
    loadFirebase('app')
    .then(() => {
      let firebase = window.firebase;
      let token = localStorage.getItem('token');
      
      if (!firebase.apps.length) {
        firebase.initializeApp(res.data.firebaseData);
      }
      if (token === null) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('firebaseData', JSON.stringify(res.data.firebaseData));
      }

      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (!isSafari && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.getRegistration(swUrl)
        .then((registration) => {
          loadFirebase('messaging')
          .then(() => {
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
                  API.saveMessagingToken(currentToken)
                  .then(messageRes => {
                    console.log(messageRes);
                    this.checkPhoto(res, firebase);
                  })
                  .catch(err => console.log(err));
                } 
                else {
                  // Show permission request.
                  console.log('No Instance ID token available. Request permission to generate one.');
                }
              })
              .catch(function(err) {
                console.log('An error occurred while retrieving token. ', err);
              });
            })
            .catch(function(err) {
              console.log('Unable to get permission to notify.', err);
            });
          });
        });
      }
      else {
        this.checkPhoto(res, firebase);
      }
    });
  }

  checkPhoto(res, firebase) {
    let defaultPhoto = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png';

    if (res.data.user.photoURL === defaultPhoto) {
      loadFirebase('storage')
      .then(() => {
        let storage = firebase.storage().ref(`${res.data.user.firstName}${res.data.user.lastName}.jpg`);
        storage.getDownloadURL()
        .then((url) => {
          API.setPhoto(url, res.data.token)
          .then((response) => {
            console.log(response)

            this.setData(response);
          })
          .catch(err => console.log(err));
        })
        .catch((error) => {
          console.log(error);

          this.setData(res);
        });
      });
    }
    else {
      this.setData(res);
    }
  }

  setData(res) {
    this.setState({
      token: res.data.token,
      name: `${res.data.user.firstName} ${res.data.user.lastName}`,
      firstName: res.data.user.firstName,
      lastName: res.data.user.lastName,
      phone: res.data.user.phone,
      email: res.data.user.email,
      class: res.data.user.class,
      major: res.data.user.major,
      status: res.data.user.status,
      photoURL: res.data.user.photoURL,
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

  render() {
    return (
      <Router >
        <div>
          <Route exact path='/' render={() => (
            this.state.isAuthenticated ? (
              <Redirect to="/pledge-app"/>
            ) : (
              this.state.loaded ? (
                <LoadableLogin 
                  state={this.state}
                  loginCallBack={this.loginCallBack}
                />
              ) : (
                <Loading />
              )
            )
          )}/>
          <Route exact path='/pledge-app' render={({history}) =>
            <LoadablePledgeApp 
              state={this.state} 
              history={history}
              loginCallBack={this.loginCallBack}
              logoutCallBack={this.logoutCallBack}
            />
          }/>
        </div>
      </Router>
    );
  }
}

export default App;
