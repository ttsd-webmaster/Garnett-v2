// @flow

import './Login.css';
import { isMobile } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import {
  LoginOptions,
  SignIn,
  SignUp,
  ForgotPassword
} from './components';

import React, { PureComponent } from 'react';

type Props = {
  loginCallback: () => void,
  handleRequestOpen: () => void
};

type State = {
  open: boolean,
  message: string
};

export class Login extends PureComponent<Props, State> {
  state = {
    open: false,
    message: ''
  };

  // TODO: Use state instead of document.getElementId
  active = (event: SyntheticEvent<>) => {
    if (!event.target.classList.contains('underline')) {
      switch (event.target.id) {
        case 'sign-in':
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
          break
        case 'sign-up':
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
          break
        case 'forgot-link':
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
          break
        default:
          throw new Error('invalid target');
      }
    }
  }

  openProgressDialog = (message: string) => {
    this.setState({ open: true, message });
  }

  closeProgressDialog = () => {
    this.setState({ open: false, message: '' });
  }

  render() {
    return (
      <div className="login animate-in">
        {!isMobile() && (
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

        <SpinnerDialog open={this.state.open} message={this.state.message} />
      </div>
    );
  }
}