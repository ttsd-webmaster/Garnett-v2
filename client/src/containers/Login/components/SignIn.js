// @flow

import {
  initializeFirebase,
  loadFirebase,
  validateEmail
} from 'helpers/functions.js';

import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';

type Props = {
  openProgressDialog: () => void,
  loginCallback: () => void,
  closeProgressDialog: () => void,
  handleRequestOpen: () => void,
  active: () => void
};

type State = {
  email: string,
  password: string
};

export class SignIn extends PureComponent<Props, State> {
  state = {
    email: '',
    password: ''
  }

  get isFormValid(): boolean {
    const { email, password } = this.state;
    if (email && validateEmail(email) && password) {
      return true;
    }
    return false;
  }

  login = () => {
    const { email, password } = this.state;

    this.props.openProgressDialog('Signing in...');
    initializeFirebase();

    loadFirebase('auth')
    .then(() => {
      const firebase= window.firebase;

      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user && user.emailVerified) {
          loadFirebase('database')
          .then(() => {
            const { displayName } = user;
            const userRef = firebase.database().ref('/users/' + displayName);

            userRef.once('value', (snapshot) => {
              const user = snapshot.val();
              localStorage.setItem('data', JSON.stringify(user));
              this.props.loginCallback(user);
            });
          });
        } else {
          const message = 'Email is not verified.';
          this.props.closeProgressDialog();
          this.props.handleRequestOpen(message);
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        const message = 'Email or password is incorrect.';
        this.props.closeProgressDialog();
        this.props.handleRequestOpen(message);
      });
    });
  }

  handleChange = (label: string, newValue: string) => {
    this.setState({ [label]: newValue });
  }

  render() {
    return (
      <form className="login-form active" id="sign-in-form">
        <TextField
          className="login-input"
          type="email"
          floatingLabelText="Email"
          floatingLabelStyle={{ color: '#888' }}
          value={this.state.email}
          onChange={(e, newValue) => this.handleChange('email', newValue)}
          onSubmit={this.login}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              this.login();
              ev.preventDefault();
            }
          }}
        />

        <TextField
          className="login-input"
          type="password"
          floatingLabelText="Password"
          floatingLabelStyle={{ color: '#888' }}
          value={this.state.password}
          onChange={(e, newValue) => this.handleChange('password', newValue)}
          onSubmit={this.login}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter' && this.isFormValid) {
              this.login();
              ev.preventDefault();
            }
          }}
        />

        <button
          type="button"
          className="login-button"
          disabled={!this.isFormValid}
          onClick={this.login}
        >
          Login
        </button>

        <div id="forgot-link" onClick={this.props.active}> Forgot Password? </div>
      </form>
    )
  }
}

