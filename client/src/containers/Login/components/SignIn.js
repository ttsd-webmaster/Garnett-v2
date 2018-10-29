import React from 'react';
import TextField from 'material-ui/TextField';

export default function SignIn(props) {
  return (
    <form className="login-form active" id="sign-in-form">
      <TextField
        className="login-input"
        type="email"
        inputStyle={{color: '#fff'}}
        floatingLabelText="Email"
        floatingLabelStyle={{color: '#888'}}
        floatingLabelFocusStyle={{color: 'var(--primary-color)'}}
        value={props.signEmail}
        onChange={(e, newValue) => props.handleChange('signEmail', newValue)}
        errorText={!props.signEmailValidation && 'Please enter a valid email.'}
        onSubmit={props.login}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            props.login();
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
        value={props.signPassword}
        onChange={(e, newValue) => props.handleChange('signPassword', newValue)}
        errorText={!props.signPasswordValidation && 'Please enter a password.'}
        onSubmit={props.login}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            props.login();
            ev.preventDefault();
          }
        }}
      />

      <div className="login-button" onClick={props.login}>
        Login
      </div>

      <div id="forgot-link" onClick={props.active}> Forgot Password? </div>
    </form>
  )
}

