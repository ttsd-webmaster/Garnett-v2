import './Login.css';
import 'react-select/dist/react-select.css';

import React, {Component} from 'react';
import {Image, FormGroup, FormControl} from 'react-bootstrap';
import Select from 'react-select';
import {formData1, selectData, formData2} from './data.js';
const firebase = window.firebase;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signEmail: '',
      signPassword: '',
      firstname: '',
      lastname: '',
      class: '',
      major: '',
      email: '',
      code: '',
      password: '',
      confirmation: '',
      staySigned: false,
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

  handleChange(value, e) {
    if (e.target) {
      this.setState({
        [value]: e.target.value
      })
    }
    else {
      this.setState({
        [value]: e.value
      })
    }
  }

  toggleSignState() {
    this.setState({
      staySigned: !this.state.staySigned
    })
  }

  login() {
    let email = this.state.signEmail;
    let password = this.state.signPassword;

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

  signUp() {
    let code = this.state.code;
    let email = this.state.email;
    let password = this.state.password;

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

  render() {
    return (
      <div className="login">
        <a className="tt-logo" role="button" href="http://ucsdthetatau.org">
          <Image className="logo" src={require('./images/logo.webp')}/>
        </a>

        <div className="login-logo">
          <Image src={require('./images/garnett.svg')} />
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

        <form className="login-form sign-in active" id="sign-in-form">
          <FormGroup controlId="formHorizontalEmail">
            <FormControl
              className="login-input"
              type="email"
              placeholder="Email"
              value={this.state.signEmail}
              onChange={(e) => this.handleChange('signEmail', e)}
             />
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <FormControl
              className="login-input"
              type="password"
              placeholder="Password"
              value={this.state.signPassword}
              onChange={(e) => this.handleChange('signPassword', e)}
             />
          </FormGroup>

          <div className="checkbox-container">
            <input 
              type="checkbox" 
              id="checkbox"
              checked={this.state.staySigned}
              onChange={this.toggleSignState}
            />
            <label htmlFor="checkbox">
              <span className="checkbox">stay signed in</span>
            </label>
          </div>

          <div className="login-button" onClick={this.login}>
            Login
          </div>
        </form>

        <form className="login-form sign-up" id="sign-up-form">
          {formData1.map((form, i) => (
            <FormGroup controlId="formBasicText" key={i}>
              <FormControl
                className="login-input"
                type={form.type}
                placeholder={form.name}
                value={this.state[`${form.value}`]}
                onChange={(e) => this.handleChange(form.value, e)}
               />
            </FormGroup>
          ))}

          {selectData.map((select, i) => (
            <FormGroup key={i}>
              <Select
                className="login-input"
                value={this.state[`${select.value}`]}
                placeholder={select.name}
                options={select.options}
                clearable={false}
                backspaceRemoves={false}
                searchable={false}
                onChange={(e) => this.handleChange(select.value, e)}
                key={i}
              />
            </FormGroup>
          ))}

          {formData2.map((form, i) => (
            <FormGroup controlId="formBasicText" key={i}>
              <FormControl
                className="login-input"
                type={form.type}
                placeholder={form.name}
                value={this.state[`${form.value}`]}
                onChange={(e) => this.handleChange(form.value, e)}
               />
            </FormGroup>
          ))}
          <div className="login-button" onClick={this.signUp}>
            Sign Up
          </div>
        </form>
      </div>
    );
  }
}
