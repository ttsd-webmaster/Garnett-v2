import './PledgeApp.css';
import { getTabStyle, androidBackOpen, androidBackClose } from 'helpers/functions';
import {
  LoadableContacts,
  LoadableSettings
} from 'helpers/LoadableComponents';
import { MyMerits } from 'containers/PledgeApp-v2/components/MyMerits/MyMerits';
import { Pledges } from 'containers/PledgeApp-v2/components/Pledges/Pledges';

import React, { PureComponent } from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

export default class PledgeApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: 'My Merits',
      index: 0,
      openMerit: false
    };
  }

  componentDidMount() {
    console.log(`Pledge app mount: ${this.props.state.name}`)
    localStorage.setItem('route', 'pledge-app');
  }

  handleChange = (index) => {
    this.setState({ index })
  };

  handleMeritOpen = () => {
    if (navigator.onLine) {
      androidBackOpen(this.handleMeritClose);
      this.setState({
        openMerit: true
      });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    androidBackClose();
    this.setState({
      openMerit: false
    });
  }

  render() {
    return (
      <div className="content-container">
        <MyMerits
          openMerit={this.state.openMerit}
          state={this.props.state}
          handleMeritOpen={this.handleMeritOpen}
          handleMeritClose={this.handleMeritClose}
          handleRequestOpen={this.props.handleRequestOpen}
          hidden={this.state.index !== 0}
        />
        <Pledges
          state={this.props.state}
          hidden={this.state.index !== 1}
        />
        <LoadableContacts
          state={this.props.state}
          actives={this.state.activeArray}
          hidden={this.state.index !== 2}
        />
        <LoadableSettings
          state={this.props.state} 
          logoutCallBack={this.props.logoutCallBack} 
          history={this.props.history}
          hidden={this.state.index !== 3}
        />
        
        <BottomNavigation
          className="bottom-tabs"
          selectedIndex={this.state.index}
          onChange={this.handleChange}
        >
          <BottomNavigationItem
            label="My Merits"
            icon={
              <i
                style={getTabStyle(this.state.index === 0)}
                className="icon-star"
              />
            }
            onClick={() => this.handleChange(0)}
          />
          <BottomNavigationItem
            label={
              this.props.state.status === 'pledge'
                ? 'Pbros'
                : 'Pledges'
            }
            icon={
              <i
                style={getTabStyle(this.state.index === 1)}
                className="icon-users"
              />
            }
            onClick={() => this.handleChange(1)}
          />
          <BottomNavigationItem
            label="Brothers"
            icon={
              <i
                style={getTabStyle(this.state.index === 2)}
                className="icon-address-book"
              />
            }
            onClick={() => this.handleChange(2)}
          />
          <BottomNavigationItem
            label="Settings"
            icon={
              <i
                style={getTabStyle(this.state.index === 3)}
                className="icon-cog"
              />
            }
            onClick={() => this.handleChange(3)}
          />
        </BottomNavigation>
      </div>
    )
  }
}