import {
  activeCode,
  pledgeCode,
  formData1,
  selectData,
  formData2
} from '../data.js';
import API from 'api/API.js';
import { validateEmail } from 'helpers/functions.js';

import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export class SignUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  get isFormInvalid() {
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
        (code === activeCode && code === pledgeCode) &&
        password.length > 7 && confirmation === password) {
      return false;
    }
    return true;
  }

  signUp = () => {
    const {
      firstName,
      lastName,
      className,
      major,
      year,
      phone,
      email,
      password
    } = this.state;

    this.props.openProgressDialog('Signing up...');

    const signUpInfo = {
      email,
      password,
      firstName,
      lastName,
      className,
      major,
      year,
      phone,
      code: this.state.code.toLowerCase(),
      pledgeCode
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
      console.log(message);
      this.props.closeProgressDialog();
      this.props.handleRequestOpen(message);
    });
  }

  handleChange = (label, newValue) => {
    this.setState({ [label]: newValue });
  }

  render() {
    return (
      <form className="login-form" id="sign-up-form">
        {formData1.map((form, i) => (
          <TextField
            className="login-input"
            type={form.type}
            inputStyle={{ color: '#fff' }}
            floatingLabelText={form.name}
            floatingLabelStyle={{ color: '#888' }}
            value={this.state[`${form.value}`]}
            onChange={(e, newValue) => this.handleChange(form.value, newValue)}
            key={i}
          />
        ))}

        {selectData.map((select, i) => (
          <SelectField
            className="login-input"
            value={this.state[`${select.value}`]}
            floatingLabelText={select.name}
            floatingLabelStyle={{ color: '#888' }}
            labelStyle={{ color: '#fff' }}
            onChange={(e, key, newValue) => this.handleChange(select.value, newValue)}
            key={i}
          >
            {select.options.map((item, i) => (
              <MenuItem
                key={i}
                value={item}
                primaryText={item}
                insetChildren
                checked={item === this.state[`${select.value}`]}
              />
            ))}
          </SelectField>
        ))}

        {formData2.map((form, i) => (
          <TextField
            className="login-input"
            type={form.type}
            inputStyle={{ color: '#fff' }}
            floatingLabelText={form.name}
            floatingLabelStyle={{ color: '#888' }}
            value={this.state[`${form.value}`]}
            onChange={(e, newValue) => this.handleChange(form.value, newValue)}
            key={i}
            onSubmit={this.signUp}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                this.signUp();
                ev.preventDefault();
              }
            }}
          />
        ))}
        
        <button
          type="button"
          className="login-button"
          disabled={this.isFormInvalid}
          onClick={this.signUp}
        >
          Sign Up
        </button>
      </form>
    )
  }
}
