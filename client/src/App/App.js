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
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');

    if (navigator.onLine) {
      if (token !== null) {
        API.getAuthStatus(token)
        .then(res => {
          console.log(res);
          this.loginCallBack(res);

          this.setState({
            isAuthenticated: true
          });
        })
        .catch((error) => {
          console.log(error);

          // localStorage.removeItem('token');
          // API.login(email, password)
          // .then(res => {
          //   console.log(res);
          //   this.loginCallBack(res);

          //   this.setState({
          //     isAuthenticated: true
          //   });
          // })
          // .catch(err => console.log(err));
          API.logout()
          .then(res => {
            console.log(res);
            this.logoutCallBack();
          })
          .catch(err => console.log('err', err));
        });
      }
      else {
        this.setState({
          loaded: true
        });
      }
    }
    else {
      let data = localStorage.getItem('data');

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
      let email = localStorage.getItem('email');
      let password = localStorage.getItem('password');
      
      if (!firebase.apps.length) {
        firebase.initializeApp({
          databaseURL: res.data.databaseURL,
          storageBucket: "garnett-42475.appspot.com"
        });
      }
      if (token === null) {
        localStorage.setItem('token', res.data.token);
      }
      if (email === null && password === null) {
        localStorage.setItem('email', res.data.user.email);
        localStorage.setItem('password', res.data.password);
      }

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
    });
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

    if (res.data.user.status === 'pledge') {
      this.setState({
        totalMerits: res.data.user.totalMerits
      });
    }
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
