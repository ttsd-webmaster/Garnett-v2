import { configureThemeMode } from 'helpers/functions';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';

export class ThemeOptions extends PureComponent {
  constructor(props) {
    super(props);
    const mode = localStorage.getItem('themeMode') || 'automatic';
    this.state = { mode };
  }

  setThemeMode(mode) {
    localStorage.setItem('themeMode', mode);
    configureThemeMode();
    this.setState({ mode });
  }

  render() {
    return (
      <List className="garnett-list">
        <div className="theme-options-container">
          <div className="theme-label">Theme Options</div>
          <div className="theme-options">
            <div
              className={
                `theme-option${this.state.mode === 'automatic' ? " active" : ""}`
              }
              onClick={() => this.setThemeMode('automatic')}
            >
              AUTOMATIC
            </div>
            <div
              className={
                `theme-option${this.state.mode === 'day' ? " active" : ""}`
              }
              onClick={() => this.setThemeMode('day')}
              >
              DAY
            </div>
            <div
              className={
                `theme-option${this.state.mode === 'night' ? " active" : ""}`
              }
              onClick={() => this.setThemeMode('night')}
            >
              NIGHT
            </div>
          </div>
        </div>
      </List>
    )
  }  
}
