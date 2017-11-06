import './Login.css';

import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {formData1, selectData, formData2} from './data.js';
const firebase = window.firebase;

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
      email: '',
      code: '',
      password: '',
      confirmation: '',
      staySigned: false,
      signEmailValidation: true,
      signPasswordValidation: true,
      firstNameValidation: true,
      lastNameValidation: true,
      classValidation: true,
      majorValidation: true,
      emailValidation: true,
      codeValidation: true,
      passwordValidation: true,
      confirmationValidation: true,
    };

    this.toggleSignState = this.toggleSignState.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
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
  }

  handleChange(label, newValue) {
    this.setState({
      [label]: newValue,
    });
  }

  toggleSignState() {
    this.setState({
      staySigned: !this.state.staySigned
    })
  }

  login() {
    let email = this.state.signEmail;
    let password = this.state.signPassword;
    let emailValidation = true;
    let passwordValidation = true;

    if (!email || !validateEmail(email) || !password) {
      if (!email || !validateEmail(email)) {
        emailValidation = false;
      }
      if (!password) {
        passwordValidation = false;
      }

      this.setState({
        signEmailValidation: emailValidation,
        signPasswordValidation: passwordValidation,
      });
    }
    else {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user.emailVerified) {
          this.props.history.push('/active-merit');
        }
        else {
          console.log('Not Verified')
        }
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorCode, errorMessage);
      })
    }
  }

  signUp() {
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let className = this.state.class;
    let majorName = this.state.major;
    let email = this.state.email;
    let code = this.state.code;
    let password = this.state.password;
    let confirmation = this.state.confirmation;
    let firstNameValidation = true;
    let lastNameValidation = true;
    let classValidation = true;
    let majorValidation = true;
    let emailValidation = true;
    let codeValidation = true;
    let passwordValidation = true;
    let confirmationValidation = true;

    if (!firstName || !lastName || !className || !majorName || !validateEmail(email) ||
        !code || code !== 'garnett' || password.length < 8 || confirmation !== password) {
      if (!firstName) {
        firstNameValidation = false;
      }
      if (!lastName) {
        lastNameValidation = false;
      }
      if (!className) {
        classValidation = false;
      }
      if (!majorName) {
        majorValidation = false;
      }
      if (!email || !validateEmail(email)) {
        emailValidation = false;
      }
      if (!code || code !== 'garnett') {
        codeValidation = false;
      }
      if (password.length < 8) {
        passwordValidation = false;
      }
      if (confirmation !== password) {
        confirmationValidation = false;
      }

      this.setState({
        firstNameValidation: firstNameValidation,
        lastNameValidation: lastNameValidation,
        classValidation: classValidation,
        majorValidation: majorValidation,
        emailValidation: emailValidation,
        codeValidation: codeValidation,
        passwordValidation: passwordValidation,
        confirmationValidation: confirmationValidation,
      });
    }
    else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (user && !user.emailVerified) {
          user.sendEmailVerification().then(function() {
            document.getElementById('sign-in').click();
          });
        }
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
    }
  }

  render() {
    return (
      <div className="login">
        <a className="tt-logo" role="button" href="http://ucsdthetatau.org">
          <img className="logo" src={require('./images/logo.webp')} alt="logo"/>
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
            />
          ))}
          <div className="login-button" onClick={this.signUp}>
            Sign Up
          </div>
        </form>
      </div>
    );
  }
}
