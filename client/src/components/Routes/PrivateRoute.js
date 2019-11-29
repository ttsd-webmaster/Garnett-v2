import React from "react";
import { Route, Redirect } from "react-router-dom";

export function PrivateRoute({
  component: Component,
  path,
  state,
  authenticated,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props => {
        if (authenticated) {
          if (state.status === 'pledge' && path !== '/pledge-app') {
            return <Redirect to="/pledge-app" />;
          }
          return <Component state={state} {...props} {...rest} />;
        }
        return <Redirect to="/login" />;
      }}
    />
  );
}
