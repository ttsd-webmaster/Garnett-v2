import React from 'react';
import TextField from 'material-ui/TextField';

export default function SignIn({
  forgotEmail,
  forgotEmailValidation,
  forgotPassword,
  handleChange
}) {
  return (
    <form className="login-form" id="forgot-password">
      <TextField
        className="login-input"
        type="email"
        inputStyle={{ color: '#fff' }}
        floatingLabelText="Email"
        floatingLabelStyle={{ color: '#888' }}
        value={forgotEmail}
        onChange={(e, newValue) => handleChange('forgotEmail', newValue)}
        errorText={!forgotEmailValidation && 'Please enter a valid email.'}
        onSubmit={forgotPassword}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            forgotPassword();
            ev.preventDefault();
          }
        }}
      />

      <div className="login-button" onClick={forgotPassword}>
        Reset Password
      </div>
    </form>
  )
}
