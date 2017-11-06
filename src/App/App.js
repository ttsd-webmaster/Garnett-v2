import './App.css';
import '../fontello/css/fontello.css';

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: 'var(--primary-color)',
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
