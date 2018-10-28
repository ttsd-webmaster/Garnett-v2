import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class SignIn extends Component {
  render() {
    return (
      <form className="login-form" id="forgot-password">
        <TextField
          className="login-input"
          type="email"
          inputStyle={{color: '#fff'}}
          floatingLabelText="Email"
          floatingLabelStyle={{color: '#888'}}
          floatingLabelFocusStyle={{color: 'var(--primary-color)'}}
          value={this.props.forgotEmail}
          onChange={(e, newValue) => this.props.handleChange('forgotEmail', newValue)}
          errorText={!this.props.forgotEmailValidation && 'Please enter a valid email.'}
          onSubmit={this.props.forgotPassword}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              this.props.forgotPassword();
              ev.preventDefault();
            }
          }}
        />

        <div className="login-button" onClick={this.props.forgotPassword}>
          Reset Password
        </div>
      </form>
    )
  }
}
