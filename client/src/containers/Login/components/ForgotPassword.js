// @flow

import API from 'api/API.js';
import { validateEmail } from 'helpers/functions.js';

import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';

type Props = {
  openProgressDialog: () => void,
  closeProgressDialog: () => void,
  handleRequestOpen: () => void
};

type State = {
  email: string
};

export class ForgotPassword extends PureComponent<Props, State> {
  state = { email: '' };

  get isFormInvalid(): boolean {
    const { email } = this.state;
    if (email.length > 0 && validateEmail(email)) {
      return false;
    }
    return true;
  }

  forgotPassword = () => {
    this.props.openProgressDialog('Sending password...');

    API.forgotPassword(this.state.email)
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

  handleChange = (email: string) => {
    this.setState({ email });
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
          onChange={(e, email) => this.handleChange(email)}
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
