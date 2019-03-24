// @flow

import React from 'react';

export function LoginOptions(props: { active: boolean }) {
  return (
    <div className="sign-options">
      <span className="sign-in underline"
        id="sign-in"
        onClick={props.active}
      >
        Sign In
      </span>
      <span className="sign-up"
        id="sign-up"
        onClick={props.active}
      >
        Sign Up
      </span>
    </div>
  )  
}
