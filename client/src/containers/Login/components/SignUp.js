// @flow

import { formData1, selectData, formData2 } from '../data.js';
import API from 'api/API.js';
import { validateEmail } from 'helpers/functions.js';
import type { LoginView } from '../Login';

import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

type Props = {
  view: LoginView,
  openProgressDialog: () => void,
  loginCallback: () => void,
  closeProgressDialog: () => void,
  handleRequestOpen: () => void
};

type State = {
  firstName: string,
  lastName: string,
  className: string,
  major: string,
  year: string,
  phone: string,
  email: string,
  code: string,
  password: string,
  confirmation: string
};

export class SignUp extends PureComponent<Props, State> {
  state = {
    firstName: '',
    lastName: '',
    className: '',
    major: '',
    year: '',
    phone: '',
    email: '',
    code: '',
    password: '',
    confirmation: ''
  };

  get isFormValid(): boolean {
    const {
      firstName,
      lastName,
      className,
      major,
      year,
      phone,
      email,
      password,
      confirmation
    } = this.state;
    const code = this.state.code.toLowerCase();

    if (firstName && lastName && className && major && year && email &&
        validateEmail(email) && phone.length === 10 && code &&
        password.length > 6 && confirmation === password) {
      return true;
    }
    return false;
  }

  signUp = () => {
    let {
      firstName,
      lastName,
      className,
      major,
      year,
      phone,
      email,
      password,
      code
    } = this.state;

    this.props.openProgressDialog('Signing up...');

    // Remove any spaces
    firstName = firstName.replace(/ /g,'');
    lastName = lastName.replace(/ /g,'');
    phone = phone.replace(/ /g,'');
    email = email.replace(/ /g,'');
    // Capitalize first name and last name
    firstName = firstName[0].toUpperCase() + firstName.substr(1);
    lastName = lastName[0].toUpperCase() + lastName.substr(1);
    code = code.toLowerCase();

    const signUpInfo = {
      firstName,
      lastName,
      email,
      password,
      className,
      major,
      year,
      phone,
      code
    };

    API.signUp(signUpInfo)
    .then(res => {
      if (res.status === 200) {
        const message = res.data;

        document.getElementById('sign-in').click();
        this.props.closeProgressDialog();
        this.props.handleRequestOpen(message);

        this.setState({
          firstName: '',
          lastName: '',
          className: '',
          major: '',
          year: '',
          phone: '',
          email: '',
          code: '',
          password: '',
          confirmation: ''
        });
      }
    })
    .catch((error) => {
      const message = error.response.data;
      this.props.closeProgressDialog();
      this.props.handleRequestOpen(message);
    });
  }

  handleChange = (label: string, newValue: string) => {
    this.setState({ [label]: newValue });
  }

  render() {
    return (
      <form
        id="sign-up-form"
        className={`login-form ${this.props.view === 'signup' ? 'active' : ''}`}
      >
        {formData1.map((form, i) => (
          <TextField
            className="login-input"
            type={form.type}
            floatingLabelText={form.placeholder}
            floatingLabelStyle={{ color: '#888' }}
            value={this.state[form.name]}
            onChange={(e, newValue) => this.handleChange(form.name, newValue)}
            key={i}
          />
        ))}

        {selectData.map((select, i) => (
          <SelectField
            className="login-input"
            value={this.state[select.name]}
            floatingLabelText={select.placeholder}
            floatingLabelStyle={{ color: '#888' }}
            onChange={(e, key, newValue) => this.handleChange(select.name, newValue)}
            key={i}
          >
            {select.options.map((item, i) => (
              <MenuItem
                key={i}
                value={item}
                primaryText={item}
                insetChildren
                checked={item === this.state[select.name]}
              />
            ))}
          </SelectField>
        ))}

        {formData2.map((form, i) => (
          <TextField
            className="login-input"
            type={form.type}
            floatingLabelText={form.placeholder}
            floatingLabelStyle={{ color: '#888' }}
            value={this.state[form.name]}
            onChange={(e, newValue) => this.handleChange(form.name, newValue)}
            key={i}
            onSubmit={this.signUp}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter' && this.isFormValid) {
                this.signUp();
                ev.preventDefault();
              }
            }}
          />
        ))}
        
        <button
          type="button"
          className="login-button"
          disabled={!this.isFormValid}
          onClick={this.signUp}
        >
          Sign Up
        </button>
      </form>
    )
  }
}
