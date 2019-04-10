// @flow

import React from 'react';
import type { LoginView } from '../Login';

type Props = {
  view: LoginView,
  changeView: (LoginView) => void
};

export function LoginOptions(props: Props) {
  return (
    <div className="sign-options">
      <span
        id="sign-in"
        className={`${props.view === 'signin' ? 'underline' : ''}`}
        onClick={() => props.changeView('signin')}
      >
        Sign In
      </span>
      <span
        id="sign-up"
        className={`${props.view === 'signup' ? 'underline' : ''}`}
        onClick={() => props.changeView('signup')}
      >
        Sign Up
      </span>
    </div>
  )  
}
