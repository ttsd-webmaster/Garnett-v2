import './Login.css';
import { isMobileDevice } from 'helpers/functions.js';
import { CompletingTaskDialog } from 'helpers/loaders.js';
import {
  LoginOptions,
  SignIn,
  SignUp,
  ForgotPassword
} from './components';

import React, { PureComponent } from 'react';

export class Login extends PureComponent {
  state = {
    open: false,
    message: ''
  }

  active = (event) => {
    if (!event.target.classList.contains('underline')) {
      if (event.target.id === 'sign-in') {
        document.getElementById('sign-in')
          .classList
          .add('underline');
        document.getElementById('sign-up')
          .classList
          .remove('underline');
        document.getElementById('sign-in-form')
          .classList
          .add('active');
        document.getElementById('sign-up-form')
          .classList
          .remove('active');
        document.getElementById('forgot-password')
          .classList
          .remove('active');
      }
      else if (event.target.id === 'sign-up') {
        document.getElementById('sign-in')
          .classList
          .remove('underline');
        document.getElementById('sign-up')
          .classList
          .add('underline');
        document.getElementById('sign-in-form')
          .classList
          .remove('active');
        document.getElementById('sign-up-form')
          .classList
          .add('active');
        document.getElementById('forgot-password')
          .classList
          .remove('active');
      }
      else if (event.target.id === 'forgot-link') {
        document.getElementById('sign-in')
          .classList
          .remove('underline');
        document.getElementById('sign-up')
          .classList
          .remove('underline');
        document.getElementById('sign-in-form')
          .classList
          .remove('active');
        document.getElementById('sign-up-form')
          .classList
          .remove('active');
        document.getElementById('forgot-password')
          .classList
          .add('active');
      }
    }
  }

  openProgressDialog = (message) => {
    this.setState({
      open: true,
      message
    });
  }

  closeProgressDialog = () => {
    this.setState({
      open: false,
      message: ''
    });
  }

  render() {
    return (
      <div className="login animate-in">
        {!isMobileDevice() && (
          <a className="tt-logo" role="button" href="http://ucsdthetatau.org">
            <img className="logo" src={require('./images/logo.png')} alt="logo"/>
          </a>
        )}

        <div className="login-logo">
          <img src={require('./images/garnett.svg')} alt="garnett"/>
          <h1> Garne<span className="tt">tt</span> </h1>
        </div>

        <div className="login-container">
          <LoginOptions active={this.active} />
          <SignIn
            active={this.active}
            loginCallback={this.props.loginCallback}
            openProgressDialog={this.openProgressDialog}
            closeProgressDialog={this.closeProgressDialog}
            handleRequestOpen={this.props.handleRequestOpen}
          />
          <SignUp
            openProgressDialog={this.openProgressDialog}
            closeProgressDialog={this.closeProgressDialog}
            handleRequestOpen={this.props.handleRequestOpen} 
          />
          <ForgotPassword
            openProgressDialog={this.openProgressDialog}
            closeProgressDialog={this.closeProgressDialog}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>

        <CompletingTaskDialog
          open={this.state.open}
          message={this.state.message}
        />
      </div>
    );
  }
}