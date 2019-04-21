// @flow

import './DataApp.css';
import 'containers/PledgeApp/PledgeApp.css';
import { getTabStyle } from 'helpers/functions';
import { PledgingData } from './components/PledgingData/PledgingData';
import { RushData } from './components/RushData/RushData';
import { MyData } from './components/MyData/MyData';
import type { User } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';

type Props = {
  history: RouterHistory,
  state: User // TODO: Use store instead of passing down state
};

type State = {
  index: number
};

export class DataApp extends PureComponent<Props, State> {
  state = { index: 0 };

  componentDidMount() {
    localStorage.setItem('route', 'data-app');
  }

  get header(): string {
    switch (this.state.index) {
      case 0:
        return 'Leaderboard';
      case 1:
        return 'Rush Data';
      case 2:
        return 'My Data';
      default:
        return '';
    }
  }

  get body(): ?Node {
    const { state } = this.props;
    switch (this.state.index) {
      case 0:
        return <PledgingData />;
      case 1:
        return <RushData />;
      case 2:
        return <MyData name={state.name} photoURL={state.photoURL} />;
      default:
    }
  }

  select = (index: number) => this.setState({ index });

  goHome = () => {
    const { history } = this.props;
    const prevPath = history.location.state || 'home';
    history.push(prevPath);
  }

  render() {
    const { index } = this.state;
    return (
      <div className="loading-container">

        <div id="data-container">
          <span id="back-button" onClick={this.goHome}>←</span>
          <h1 id="data-app-header">{ this.header }</h1>
          { this.body }
        </div>

        <BottomNavigation
          className="bottom-tabs"
          selectedIndex={index}
        >
          <BottomNavigationItem
            label={<span style={getTabStyle(index === 0)}>Pledging</span>}
            icon={
              <FontIcon
                style={getTabStyle(index === 0)}
                className="icon-handshake-o"
              />
            }
            onClick={() => this.select(0)}
          />
          <BottomNavigationItem
            label={<span style={getTabStyle(index === 1)}>Rush</span>}
            icon={
              <FontIcon
                style={getTabStyle(index === 1)}
                className="icon-users"
              />
            }
            onClick={() => this.select(1)}
          />
          <BottomNavigationItem
            label={<span style={getTabStyle(index === 2)}>Me</span>}
            icon={
              <FontIcon
                style={getTabStyle(index === 2)}
                className="icon-user"
              />
            }
            onClick={() => this.select(2)}
          />
        </BottomNavigation>
      </div>
    )
  }
}
