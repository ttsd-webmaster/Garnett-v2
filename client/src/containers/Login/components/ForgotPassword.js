import API from 'api/API.js';
import { validateEmail } from 'helpers/functions.js';

import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';

export class ForgotPassword extends PureComponent {
  state = { email: '' }

  get isFormInvalid() {
    const { email } = this.state;
    console.log(email)
    if (email.length > 0 && validateEmail(email)) {
      return false;
    }
    return true;
  }

  forgotPassword = () => {
    const { email } = this.state;

    this.props.openProgressDialog('Sending password...');

    API.forgotPassword(email)
    .then(res => {
      const message = res.data;
      document.getElementById('sign-in').click();
      this.props.closeProgressDialog();
      this.props.handleRequestOpen(message);
    })
    .catch(error => {
      const message = error.response.data;
      this.props.closeProgressDialog();
      this.props.handleRequestOpen(message);
    });
  }

  handleChange = (newValue) => {
    this.setState({ email: newValue });
  }

  render() {
    return (
      <form className="login-form" id="forgot-password">
        <TextField
          className="login-input"
          type="email"
          inputStyle={{ color: '#fff' }}
          floatingLabelText="Email"
          floatingLabelStyle={{ color: '#888' }}
          value={this.state.email}
          onChange={(e, newValue) => this.handleChange(newValue)}
          onSubmit={this.forgotPassword}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              this.forgotPassword();
              ev.preventDefault();
            }
          }}
        />

        <button
          type="button"
          className="login-button"
          disabled={this.isFormInvalid}
          onClick={this.forgotPassword}
        >
          Reset Password
        </button>
      </form>
    )
  }
}
