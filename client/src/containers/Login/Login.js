import '../../App/App.css';
import './Login.css';
import {activeCode, pledgeCode} from './data.js';
import {initializeFirebase, loadFirebase, validateEmail} from '../../helpers/functions.js';
import API from '../../api/API.js';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';

import React, {Component} from 'react';
import Snackbar from 'material-ui/Snackbar';

const snackbarBackground = {
  backgroundColor: '#fff'
};

const snackbarText = {
  color: 'var(--secondary-dark)'
};

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
      forgotEmail: '',
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
      forgotEmailValidation: true,
      open: false,
      message: '',
    };
  }

  componentDidMount() {
    console.log("Login js mount")
    let pullToRefresh = document.querySelector('.ptr--ptr');

    if (pullToRefresh) {
      pullToRefresh.style.marginTop = 0;
    }
  }

  active = (event) => {
    if (!event.target.classList.contains('underline')) {
      if (event.target.id === 'sign-in') {
        document.getElementById('sign-in')
          .classList
          .add('underline');
        document.getElementById('sign-up')
          .classList
          .remove('underline');
        document.getElementById('sign-in-form')
          .classList
          .add('active');
        document.getElementById('sign-up-form')
          .classList
          .remove('active');
        document.getElementById('forgot-password')
          .classList
          .remove('active');
      }
      else if (event.target.id === 'sign-up') {
        document.getElementById('sign-in')
          .classList
          .remove('underline');
        document.getElementById('sign-up')
          .classList
          .add('underline');
        document.getElementById('sign-in-form')
          .classList
          .remove('active');
        document.getElementById('sign-up-form')
          .classList
          .add('active');
        document.getElementById('forgot-password')
          .classList
          .remove('active');
      }
      else if (event.target.id === 'forgot-link') {
        document.getElementById('sign-in')
          .classList
          .remove('underline');
        document.getElementById('sign-up')
          .classList
          .remove('underline');
        document.getElementById('sign-in-form')
          .classList
          .remove('active');
        document.getElementById('sign-up-form')
          .classList
          .remove('active');
        document.getElementById('forgot-password')
          .classList
          .add('active');
      }
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
      forgotEmailValidation: true,
    });
  }

  login = () => {
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
      API.login(email, password)
      .then(res => {
        if (res.status === 200) {
          localStorage.setItem('data', JSON.stringify(res));

          initializeFirebase(res.data.firebaseData);

          loadFirebase('auth')
          .then(() => {
            let firebase = window.firebase;
            
            firebase.auth().signInWithCustomToken(res.data.token)
            .then(() => {
              this.props.loginCallBack(res);
              
              // this.setState({
              //   signEmail: '',
              //   signPassword: '',
              // });
            })
            .catch((error) => {
              console.log(error);
            });
          });
        }
      })
      .catch((error) => {
        let message = error.response.data;
        console.log(error);

        this.handleRequestOpen(message);
      });
    }
  }

  signUp = () => {
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let className = this.state.class;
    let majorName = this.state.major;
    let year = this.state.year;
    let phone = this.state.phone;
    let email = this.state.email;
    let code = this.state.code.toLowerCase();
    let password = this.state.password;
    let confirmation = this.state.confirmation;
    let firstNameValidation = true;
    let lastNameValidation = true;
    let classValidation = true;
    let majorValidation = true;
    let yearValidation = true;
    let phoneValidation = true;
    let emailValidation = true;
    let codeValidation = true;
    let passwordValidation = true;
    let confirmationValidation = true;

    if (!firstName || !lastName || !className || !majorName || !year || !validateEmail(email) ||
        phone.length !== 10 || !code || (code !== activeCode && code !== pledgeCode) || 
        password.length < 8 || confirmation !== password) {
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
      if (!year) {
        yearValidation = false;
      }
      if (phone.length !== 10) {
        phoneValidation = false;
      }
      if (!email || !validateEmail(email)) {
        emailValidation = false;
      }
      if (!code || (code !== activeCode && code !== pledgeCode)) {
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
        yearValidation: yearValidation,
        phoneValidation: phoneValidation,
        emailValidation: emailValidation,
        codeValidation: codeValidation,
        passwordValidation: passwordValidation,
        confirmationValidation: confirmationValidation,
      });
    }
    else {
      API.signUp(email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode)
      .then(res => {
        if (res.status === 200) {
          let message = res.data;

          document.getElementById('sign-in').click();
          this.handleRequestOpen(message);

          this.setState({
            firstName: '',
            lastName: '',
            class: '',
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
        let message = error.response.data;

        console.log(message);

        this.handleRequestOpen(message);
      });
    }
  }

  forgotPassword = () => {
    let email = this.state.forgotEmail;

    if (!email || !validateEmail(email)) {
      this.setState({
        forgotEmailValidation: false
      });
    }
    else {
      API.forgotPassword(email)
      .then(res => {
        let message = res.data;

        document.getElementById('sign-in').click();
        this.handleRequestOpen(message);
      })
      .catch(error => {
        let message = error.response.data;

        this.handleRequestOpen(message);
      });
    }
  }

  handleChange = (label, newValue) => {
    let validationLabel = [label] + 'Validation';

    this.setState({
      [label]: newValue,
      [validationLabel]: true
    });
  }

  handleRequestOpen = (message) => {
    this.setState({
      open: true,
      message: message
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div className="login">
        {/*<a className="tt-logo" role="button" href="http://ucsdthetatau.org">
          <img className="logo" src={require('./images/logo.png')} alt="logo"/>
        </a>*/}

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

        <SignIn
          signEmail={this.state.signEmail}
          signPassword={this.state.signPassword}
          signEmailValidation={this.state.signEmailValidation}
          signPasswordValidation={this.state.signPasswordValidation}
          login={this.login}
          handleChange={this.handleChange}
          handleRequestOpen={this.handleRequestOpen}
          active={this.active}
        />
        <SignUp
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          class={this.state.class}
          major={this.state.major}
          year={this.state.year}
          phone={this.state.phone}
          email={this.state.email}
          code={this.state.code}
          password={this.state.password}
          confirmation={this.state.confirmation}
          firstNameValidation={this.state.firstNameValidation}
          lastNameValidation={this.state.lastNameValidation}
          classValidation={this.state.classValidation}
          majorValidation={this.state.majorValidation}
          yearValidation={this.state.yearValidation}
          phoneValidation={this.state.phoneValidation}
          emailValidation={this.state.emailValidation}
          codeValidation={this.state.codeValidation}
          passwordValidation={this.state.passwordValidation}
          confirmationValidation={this.state.confirmationValidation}
          signUp={this.signUp}
          handleChange={this.handleChange}
          handleRequestOpen={this.handleRequestOpen} 
        />
        <ForgotPassword
          forgotEmail={this.state.forgotEmail}
          forgotEmailValidation={this.state.forgotEmailValidation}
          forgotPassword={this.forgotPassword}
          handleChange={this.handleChange}
          handleRequestOpen={this.handleRequestOpen}
        />

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