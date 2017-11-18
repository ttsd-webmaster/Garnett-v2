import './App.css';
import '../fontello/css/fontello.css';
import API from '../api/API.js'
import React, {Component} from 'react';
import Login from '../containers/Login/Login';
import PledgeApp from '../containers/PledgeApp/PledgeApp';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import firebase from '@firebase/app';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      isAuthenticated: false,
      loaded: false
    };

    this.toggleSignState = this.toggleSignState.bind(this);
    this.loginCallBack = this.loginCallBack.bind(this);
  }

  componentDidMount() {
    let token = localStorage.getItem('token');

    if (token !== null) {
      API.getAuthStatus(token)
      .then(res => {
        if (res.data !== 'Not Authenticated') {
          console.log(res)

          this.loginCallBack(res);
        }

        console.log('Got Auth Status')
        this.setState({
          isAuthenticated: true
        });
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem('token');
      });
    }
    else {
      this.setState({
        loaded: true
      });
    }
  }

  toggleSignState() {
    this.setState({
      staySigned: !this.state.staySigned
    });
  }

  loginCallBack = (res) => {
    if (!firebase.apps.length) {
      firebase.initializeApp({databaseURL: res.data.databaseURL});
    }
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    console.log(localStorage.getItem('token'));
    
    this.setState({
      token: res.data.token,
      name: `${res.data.user.firstName} ${res.data.user.lastName}`,
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
    localStorage.removeItem('token');

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
                <Login 
                  state={this.state}
                  loginCallBack={this.loginCallBack}
                />
              ) : (
              <div className="loading">
                <div className="loading-image"></div>
              </div>
              )
            )
          )}/>
          <Route exact path='/pledge-app' render={({history}) =>
            <PledgeApp 
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
