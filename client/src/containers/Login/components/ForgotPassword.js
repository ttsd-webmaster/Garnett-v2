import React from 'react';
import TextField from 'material-ui/TextField';

export default function SignIn(props) {
  return (
    <form className="login-form" id="forgot-password">
      <TextField
        className="login-input"
        type="email"
        inputStyle={{color: '#fff'}}
        floatingLabelText="Email"
        floatingLabelStyle={{color: '#888'}}
        floatingLabelFocusStyle={{color: 'var(--primary-color)'}}
        value={props.forgotEmail}
        onChange={(e, newValue) => props.handleChange('forgotEmail', newValue)}
        errorText={!props.forgotEmailValidation && 'Please enter a valid email.'}
        onSubmit={props.forgotPassword}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            props.forgotPassword();
            ev.preventDefault();
          }
        }}
      />

      <div className="login-button" onClick={props.forgotPassword}>
        Reset Password
      </div>
    </form>
  )
}
