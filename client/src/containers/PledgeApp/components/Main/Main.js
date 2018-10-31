import './Main.css';

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { MyMerits, Pledges, Contacts } from 'containers/PledgeApp/components';

const routes = [
  {
    path: '/pledge-app/my-merits',
    exact: true,
    content: props => <MyMerits state={props.state} />
  },
  {
    path: '/pledge-app/pledges',
    exact: true,
    content: props => <Pledges state={props.state} />
  },
  {
    path: '/pledge-app/brothers',
    exact: true,
    content: props => <Contacts state={props.state} />
  }
];

export function Main(props) {
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
