import './index.css';
// import registerServiceWorker from './registerServiceWorker.js';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import App from './App/App';
import Login from './containers/Login/Login';
import PledgeApp from './containers/PledgeApp/PledgeApp';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/pledge-app' component={PledgeApp}/>
        <Route path='*' component={Login}/>
      </Switch>
    </App>
  </BrowserRouter>, 
  document.getElementById('root')
);
  