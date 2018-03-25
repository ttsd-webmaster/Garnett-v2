import './index.css';
import './App.css';
import registerServiceWorker from './registerServiceWorker';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from './App/App';
import React from 'react';
import ReactDOM from 'react-dom';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: 'var(--primary-color)',
    primary2Color: 'var(--complement-color)',
    accent1Color: 'var(--primary-color)',
    pickerHeaderColor: 'var(--primary-color)'
  },
});

const Index = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <App />
  </MuiThemeProvider>
)

ReactDOM.render(
  <Index/>,
  document.getElementById('root')
);
registerServiceWorker();
