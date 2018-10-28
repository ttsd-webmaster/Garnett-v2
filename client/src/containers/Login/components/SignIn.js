import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class SignIn extends Component {
  render() {
    return (
      <form className="login-form active" id="sign-in-form">
        <TextField
          className="login-input"
          type="email"
          inputStyle={{color: '#fff'}}
          floatingLabelText="Email"
          floatingLabelStyle={{color: '#888'}}
          floatingLabelFocusStyle={{color: 'var(--primary-color)'}}
          value={this.props.signEmail}
          onChange={(e, newValue) => this.props.handleChange('signEmail', newValue)}
          errorText={!this.props.signEmailValidation && 'Please enter a valid email.'}
          onSubmit={this.props.login}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              this.props.login();
              ev.preventDefault();
            }
          }}
        />

        <TextField
          className="login-input"
          type="password"
          inputStyle={{color: '#fff'}}
          floatingLabelText="Password"
          floatingLabelStyle={{color: '#888'}}
          floatingLabelFocusStyle={{color: 'var(--primary-color'}}
          value={this.props.signPassword}
          onChange={(e, newValue) => this.props.handleChange('signPassword', newValue)}
          errorText={!this.props.signPasswordValidation && 'Please enter a password.'}
          onSubmit={this.props.login}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              this.props.login();
              ev.preventDefault();
            }
          }}
        />

        <div className="login-button" onClick={this.props.login}>
          Login
        </div>

        <div id="forgot-link" onClick={this.props.active}> Forgot Password? </div>
      </form>
    )
  }
}

