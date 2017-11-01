import './index.css';
// import registerServiceWorker from './registerServiceWorker.js';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import App from './App/App';
import Login from './containers/Login/Login';
import Garnett from './containers/Garnett/Garnett';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/garnett' component={Garnett}/>
        <Route path='*' component={Login}/>
      </Switch>
    </App>
  </BrowserRouter>, 
  document.getElementById('root'));
  