import React from "react";
import { Route, Redirect } from "react-router-dom";

export function PublicRoute({
  component: Component,
  authenticated,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} {...rest} />
        )
      }
    />
  );
}
