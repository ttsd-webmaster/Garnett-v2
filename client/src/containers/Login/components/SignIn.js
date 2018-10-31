import React from 'react';
import TextField from 'material-ui/TextField';

export default function SignIn({
  signEmail,
  signEmailValidation,
  login,
  signPassword,
  signPasswordValidation,
  active,
  handleChange
}) {
  return (
    <form className="login-form active" id="sign-in-form">
      <TextField
        className="login-input"
        type="email"
        inputStyle={{color: '#fff'}}
        floatingLabelText="Email"
        floatingLabelStyle={{color: '#888'}}
        floatingLabelFocusStyle={{color: 'var(--primary-color)'}}
        value={signEmail}
        onChange={(e, newValue) => handleChange('signEmail', newValue)}
        errorText={!signEmailValidation && 'Please enter a valid email.'}
        onSubmit={login}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            login();
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
        value={signPassword}
        onChange={(e, newValue) => handleChange('signPassword', newValue)}
        errorText={!signPasswordValidation && 'Please enter a password.'}
        onSubmit={login}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            login();
            ev.preventDefault();
          }
        }}
      />

      <div className="login-button" onClick={login}>
        Login
      </div>

      <div id="forgot-link" onClick={active}> Forgot Password? </div>
    </form>
  )
}

