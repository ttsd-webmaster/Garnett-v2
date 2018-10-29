import './Main.css';
import { LoadableContacts } from 'helpers/LoadableComponents';

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { MyMerits } from '../MyMerits/MyMerits';
import { Pledges } from '../Pledges/Pledges';

const routes = [
  {
    path: '/pledge-app/my-merits',
    exact: true,
    content: props => <MyMerits state={props.state} />
  },
  {
    path: '/pledge-app/pledge-brothers',
    exact: true,
    content: props => <Pledges state={props.state} />
  },
  {
    path: '/pledge-app/brothers',
    exact: true,
    content: props => <LoadableContacts state={props.state} />
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
