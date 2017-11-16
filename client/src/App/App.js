import './App.css';
import '../fontello/css/fontello.css';
import API from '../api/API.js'
import React, {Component} from 'react';
import Login from '../containers/Login/Login';
import PledgeApp from '../containers/PledgeApp/PledgeApp';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

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

  componentWillMount() {
    let isAuthenticated = false;

    API.getAuthStatus()
    .then(res => {
      if (res.data !== 'Not Authenticated') {
        isAuthenticated = true;

        console.log(res)

        this.loginCallBack(res);
      }

      console.log('Got Auth Status')
      this.setState({
        isAuthenticated: isAuthenticated,
        loaded: true
      });
    })
    .catch(err => console.log('err', err));
  }

  toggleSignState() {
    this.setState({
      staySigned: !this.state.staySigned
    });
  }

  loginCallBack = (res) => {
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

  logOutCallBack = () => {
    this.setState({
      isAuthenticated: false
    })
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
              logOutCallBack={this.logOutCallBack}
            />
          }/>
        </div>
      </Router>
    );
  }
}

export default App;
