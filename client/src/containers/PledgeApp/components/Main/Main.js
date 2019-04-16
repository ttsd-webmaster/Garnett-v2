// @flow

import './Main.css';
import { MyMerits, Pledges, Contacts, Settings } from 'containers/PledgeApp/components';
import type { User } from 'api/models';

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

const routes = [
  {
    path: '/pledge-app/my-merits',
    exact: true,
    content: props => (
      <MyMerits
        state={props.state}
        handleRequestOpen={props.handleRequestOpen}
      />
    )
  },
  {
    path: '/pledge-app/pledges',
    exact: true,
    content: props => (
      <Pledges
        state={props.state}
        handleRequestOpen={props.handleRequestOpen}
      />
    )
  },
  {
    path: '/pledge-app/brothers',
    exact: true,
    content: props => (
      <Contacts />
    )
  },
  {
    path: '/pledge-app/settings',
    exact: true,
    content: props => (
      <Settings
        history={props.history}
        state={props.state}
        handleRequestOpen={props.handleRequestOpen}
        logoutCallBack={props.logoutCallBack}
      />
    )
  }
];

type Props = {
  state: User,
  handleRequestOpen: () => void,
  logoutCallBack?: () => void
};

export function Main(props: Props) {
  return (
    <div id="content">
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            exact={route.exact}
            path={route.path}
            render={() => route.content(props)}
          />
        ))}
        <Redirect from="/pledge-app" to="/pledge-app/my-merits" />
      </Switch>
    </div>
  )
}
