import React from 'react';

export function LoginOptions({ active }) {
  return (
    <div className="sign-options">
      <span className="sign-in underline"
        id="sign-in"
        onClick={active}
      >
        Sign In
      </span>
      <span className="sign-up"
        id="sign-up"
        onClick={active}
      >
        Sign Up
      </span>
    </div>
  )  
}
