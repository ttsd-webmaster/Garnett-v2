// @flow

import './MyMerits.css';
import {
  isMobile,
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions.js';
import { MyMeritsList, AllMeritsList, ToggleViewHeader } from './components';
import { LoadableMobileMeritDialog } from './components/Dialogs';
import type { User } from 'api/models';

import React, { PureComponent, Fragment } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

type Props = {
  state: User,
  handleRequestOpen: () => void
};

type State = {
  view: 'myMerits' | 'allMerits',
  openMerit: boolean,
  scrollDirection: 'up' | 'down' | null,
  lastScrollTop: number
};

export class MyMerits extends PureComponent<Props, State> {
  containerRef: ?HtmlDivElement
  state = {
    view: 'allMerits',
    openMerit: false,
    scrollDirection: null,
    lastScrollTop: 0
  };

  componentDidMount() {
    if (this.containerRef) {
      this.containerRef.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (this.containerRef) {
      this.containerRef.removeEventListener('scroll', this.handleScroll);
    }
  }

  get meritsList(): Node {
    const { state, handleRequestOpen } = this.props;
    const { view } = this.state;
    if (view === 'allMerits' && state.status !== 'pledge') {
      return <AllMeritsList state={state} />
    }
    return <MyMeritsList state={state} handleRequestOpen={handleRequestOpen} />
  }

  handleScroll = (event) => {
    if (!this.containerRef) {
      return
    }
    const { scrollTop } = this.containerRef;
    const scrollDirection = scrollTop > this.state.lastScrollTop ? 'down' : 'up';
    const lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    this.setState({ scrollDirection, lastScrollTop })
  }

  setView = (value: string) => this.setState({ view: value });

  handleMeritOpen = () => {
    if (navigator.onLine) {
      iosFullscreenDialogOpen();
      androidBackOpen(this.handleMeritClose);
      this.setState({ openMerit: true });
    } else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    androidBackClose();
    this.setState({ openMerit: false }, () => {
      iosFullscreenDialogClose();
    });
  }

  render() {
    const { state, handleRequestOpen } = this.props;
    const { view, openMerit, scrollDirection } = this.state;
    
    return (
      <div
        id="my-merits"
        className="animate-in"
        ref={(ref) => this.containerRef = ref}
      >
        {state.status !== 'pledge' && (
          <ToggleViewHeader
            view={view}
            setView={this.setView}
          />
        )}

        { this.meritsList }

        {isMobile() && (
          <Fragment>
            <LoadableMobileMeritDialog
              open={openMerit}
              state={state}
              handleMeritClose={this.handleMeritClose}
              handleRequestOpen={handleRequestOpen}
            />
            <FloatingActionButton
              className={`fixed-button ${scrollDirection === 'down' ? 'hidden' : ''}`}
              onClick={this.handleMeritOpen}
            >
              <i className="icon-pencil"></i>
            </FloatingActionButton>
          </Fragment>
        )}
      </div>
    )
  }
}
