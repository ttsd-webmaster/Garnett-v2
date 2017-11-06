import './index.css';
// import registerServiceWorker from './registerServiceWorker.js';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import App from './App/App';
import Login from './containers/Login/Login';
import ActiveMerit from './containers/ActiveMerit/ActiveMerit';
import PledgeMerit from './containers/PledgeMerit/PledgeMerit';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/active-merit' component={ActiveMerit}/>
        <Route exact path='/pledge-merit' component={PledgeMerit}/>
        <Route path='*' component={Login}/>
      </Switch>
    </App>
  </BrowserRouter>, 
  document.getElementById('root')
);
  