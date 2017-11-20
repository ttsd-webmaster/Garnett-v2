import './Login.css';
import API from "../../api/API.js"
import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import {activeCode, pledgeCode, formData1, selectData, formData2} from './data.js';

const snackbarBackground = {
  backgroundColor: '#fff'
};

const snackbarText = {
  color: '#000'
};

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signEmail: '',
      signPassword: '',
      firstName: '',
      lastName: '',
      class: '',
      major: '',
      year: '',
      phone: '',
      email: '',
      code: '',
      password: '',
      confirmation: '',
      open: false,
      message: '',
      staySigned: false,
      signEmailValidation: true,
      signPasswordValidation: true,
      firstNameValidation: true,
      lastNameValidation: true,
      classValidation: true,
      majorValidation: true,
      yearValidation: true,
      phoneValidation: true,
      emailValidation: true,
      codeValidation: true,
      passwordValidation: true,
      confirmationValidation: true,
    };
  }

  componentDidMount() {
    console.log("Login js mount")
  }

  active = (event) => {
    if (!event.target.classList.contains('underline')) {
      document.getElementById('sign-in')
        .classList
        .toggle('underline');
      document.getElementById('sign-up')
        .classList
        .toggle('underline');
      document.getElementById('sign-in-form')
        .classList
        .toggle('active');
      document.getElementById('sign-up-form')
        .classList
        .toggle('active');
    }

    this.setState({
      signEmailValidation: true,
      signPasswordValidation: true,
      firstNameValidation: true,
      lastNameValidation: true,
      classValidation: true,
      majorValidation: true,
      yearValidation: true,
      phoneValidation: true,
      emailValidation: true,
      codeValidation: true,
      passwordValidation: true,
      confirmationValidation: true,
    });
  }

  handleChange(label, newValue) {
    let validationLabel = [label] + 'Validation';

    this.setState({
      [label]: newValue,
      [validationLabel]: true,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  toggleSignState = () => {
    this.setState({
      staySigned: !this.state.staySigned
    });
  }

  login = () => {
  }

  signUp = () => {
  }

  render() {
    return (
      <div className="login">
        <a className="tt-logo" role="button" href="http://ucsdthetatau.org">
          <img className="logo" src={require('./images/logo.png')} alt="logo"/>
        </a>

        <div className="login-logo">
          <img src={require('./images/garnett.svg')} alt="garnett"/>
          <h1> Garne<span className="tt">tt</span> </h1>
        </div>

        <div className="sign-options">
          <span className="sign-in underline"
            id="sign-in"
            onClick={this.active}
          >
            Sign In
          </span>
          <span className="sign-up"
            id="sign-up"
            onClick={this.active}
          >
            Sign Up
          </span>
        </div>

        <form className="login-form active" id="sign-in-form">
          <TextField
            className="login-input"
            type="email"
            inputStyle={{color: '#fff'}}
            floatingLabelText="Email"
            floatingLabelStyle={{color: '#888'}}
            floatingLabelFocusStyle={{color: 'var(--primary-color)'}}
            value={this.state.signEmail}
            onChange={(e, newValue) => this.handleChange('signEmail', newValue)}
            errorText={!this.state.signEmailValidation && 'Please enter a valid email.'}
           />

          <TextField
            className="login-input"
            type="password"
            inputStyle={{color: '#fff'}}
            floatingLabelText="Password"
            floatingLabelStyle={{color: '#888'}}
            floatingLabelFocusStyle={{color: 'var(--primary-color'}}
            value={this.state.signPassword}
            onChange={(e, newValue) => this.handleChange('signPassword', newValue)}
            errorText={!this.state.signPasswordValidation && 'Please enter a password.'}
            onSubmit={this.login}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                this.login();
                ev.preventDefault();
              }
            }}
           />

          {/*<div className="checkbox-container">
            <input 
              type="checkbox" 
              id="checkbox"
              checked={this.state.staySigned}
              onChange={this.toggleSignState}
            />
            <label htmlFor="checkbox">
              <span className="checkbox">stay signed in</span>
            </label>
          </div>*/}

          <div className="login-button" onClick={this.login}>
            Login
          </div>
        </form>
        <form className="login-form sign-up" id="sign-up-form">
          {formData1.map((form, i) => (
            <TextField
              className="login-input"
              type={form.type}
              inputStyle={{color: '#fff'}}
              floatingLabelText={form.name}
              floatingLabelStyle={{color: '#888'}}
              floatingLabelFocusStyle={{color: 'var(--primary-color'}}
              value={this.state[`${form.value}`]}
              onChange={(e, newValue) => this.handleChange(form.value, newValue)}
              errorText={!this.state[`${form.value + 'Validation'}`] && form.errorText}
              key={i}
            />
          ))}

          {selectData.map((select, i) => (
            <SelectField
              className="login-input"
              value={this.state[`${select.value}`]}
              floatingLabelText={select.name}
              floatingLabelStyle={{color: '#888'}}
              labelStyle={{color: '#fff'}}
              onChange={(e, key, newValue) => this.handleChange(select.value, newValue)}
              errorText={!this.state[`${select.value + 'Validation'}`] && select.errorText}
              key={i}
            >
              {select.options.map((item, i) => (
                <MenuItem key={i} value={item.value} primaryText={item.label} />
              ))}
            </SelectField>
          ))}

          {formData2.map((form, i) => (
            <TextField
              className="login-input"
              type={form.type}
              inputStyle={{color: '#fff'}}
              floatingLabelText={form.name}
              floatingLabelStyle={{color: '#888'}}
              floatingLabelFocusStyle={{color: 'var(--primary-color'}}
              value={this.state[`${form.value}`]}
              onChange={(e, newValue) => this.handleChange(form.value, newValue)}
              errorText={!this.state[`${form.value + 'Validation'}`] && form.errorText}
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
          <div className="login-button" onClick={this.signUp}>
            Sign Up
          </div>
        </form>

        <Snackbar
          bodyStyle={snackbarBackground}
          contentStyle={snackbarText}
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}