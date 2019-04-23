// @flow

import './Main.css';
import { isMobile } from 'helpers/functions';
import {
  MyMerits,
  Pledges,
  Contacts,
  Interviews,
  Settings
} from 'containers/PledgeApp/components';
import type { User } from 'api/models';

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

const routes = [
  {
    path: '/pledge-app/my-merits',
    exact: true,
    content: (props, scrollDirection) => (
      <MyMerits
        state={props.state}
        scrollDirection={scrollDirection}
        handleRequestOpen={props.handleRequestOpen}
      />
    )
  },
  {
    path: '/pledge-app/interviews',
    exact: true,
    content: props => (
      <Interviews state={props.state} />
    )
  },
  {
    path: '/pledge-app/pledges',
    exact: true,
    content: props => (
      <Pledges
        state={props.state}
        handleRequestOpen={props.handleRequestOpen}
      />
    )
  },
  {
    path: '/pledge-app/brothers',
    exact: true,
    content: props => (
      <Contacts />
    )
  },
  {
    path: '/pledge-app/settings',
    exact: true,
    content: props => (
      <Settings
        history={props.history}
        state={props.state}
        handleRequestOpen={props.handleRequestOpen}
        logoutCallBack={props.logoutCallBack}
      />
    )
  }
];

type Props = {
  state: User,
  handleRequestOpen: () => void,
  logoutCallBack: () => void
};

type State = {
  scrollDirection: 'up' | 'down' | null,
  lastScrollTop: number
};

export class Main extends Component<Props, State> {
  containerRef: ?HtmlDivElement
  state = {
    scrollDirection: null,
    lastScrollTop: 0
  };

  componentDidMount() {
    if (isMobile() && this.containerRef) {
      this.containerRef.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (isMobile() && this.containerRef) {
      this.containerRef.removeEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = () => {
    if (!this.containerRef) {
      return
    }
    const { scrollTop } = this.containerRef;
    const scrollDirection = scrollTop > this.state.lastScrollTop ? 'down' : 'up';
    const lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    this.setState({ scrollDirection, lastScrollTop })
  }

  render() {
    const { scrollDirection } = this.state;
    return (
      <div id="content-container" ref={(ref) => this.containerRef = ref}>
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              exact={route.exact}
              path={route.path}
              render={() => route.content(this.props, scrollDirection)}
            />
          ))}
          <Redirect from="/pledge-app" to="/pledge-app/my-merits" />
        </Switch>
      </div>
    )
  }
}
