import './index.css';
import registerServiceWorker from './registerServiceWorker';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from './App/App';
import React from 'react';
import ReactDOM from 'react-dom';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: 'var(--primary-color)',
    primary2Color: 'var(--accent-color)',
    accent1Color: 'var(--accent-color)',
    pickerHeaderColor: 'var(--primary-color)'
  },
});

let message = registerServiceWorker();
console.log(message);

const Index = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <App message={message} />
  </MuiThemeProvider>
);

ReactDOM.render(
  <Index/>,
  document.getElementById('root')
);
