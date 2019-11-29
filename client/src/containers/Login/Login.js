// @flow

import './Login.css';
import ttLogo from './images/logo.png';
import garnettLogo from './images/garnett.svg';
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

export type LoginView = 'signin' | 'signup' | 'forgotPassword';

type State = {
  open: boolean,
  message: string,
  view: LoginView
};

export class Login extends PureComponent<Props, State> {
  state = {
    open: false,
    message: '',
    view: 'signin'
  };

  changeView = (view: LoginView) => this.setState({ view });

  openProgressDialog = (message: string) => {
    this.setState({ open: true, message });
  }

  closeProgressDialog = () => {
    this.setState({ open: false, message: '' });
  }

  render() {
    return (
      <div className="login animate-in">
        <a id="tt-logo" role="button" href="http://ucsdthetatau.org">
          <img className="logo" src={ttLogo} alt="TT Logo"/>
        </a>

        <div className="login-logo">
          <img src={garnettLogo} alt="Garnett Logo"/>
          <h1> Garne<span className="tt">tt</span> </h1>
        </div>

        <div className="login-container">
          <LoginOptions view={this.state.view} changeView={this.changeView} />
          <SignIn
            view={this.state.view}
            changeView={this.changeView}
            loginCallback={this.props.loginCallback}
            openProgressDialog={this.openProgressDialog}
            closeProgressDialog={this.closeProgressDialog}
            handleRequestOpen={this.props.handleRequestOpen}
          />
          <SignUp
            view={this.state.view}
            openProgressDialog={this.openProgressDialog}
            closeProgressDialog={this.closeProgressDialog}
            handleRequestOpen={this.props.handleRequestOpen} 
          />
          <ForgotPassword
            view={this.state.view}
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