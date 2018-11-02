import './index.css';
import registerServiceWorker from './registerServiceWorker.js';
import { theme } from './helpers/theme.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from './App/App';
import React from 'react';
import ReactDOM from 'react-dom';

const Index = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);

registerServiceWorker();
