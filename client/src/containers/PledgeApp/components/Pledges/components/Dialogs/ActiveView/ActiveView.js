import './ActiveView.css';
import { getTabStyle, isMobileDevice } from 'helpers/functions.js';
import { UserInfo } from 'components';

import React, { PureComponent } from 'react';
import Loadable from 'react-loadable';
import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';
import SwipeableViews from 'react-swipeable-views';

const inkBarStyle = {
  position: 'fixed',
  bottom: 'auto',
  zIndex: 2
};

const slideContainer = {
  minHeight: 'calc(100vh - 112px)',
  WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
};

const LoadableMeritsList = Loadable({
  loader: () => import('./MeritsList'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

export class ActiveView extends PureComponent {
  state = { index: 0 }

  componentWillReceiveProps(nextProps) {
    this.setState({ index: 0 });
  }

  handleChange = (index) => {
    this.setState({ index });
  }

  render() {
    const {
      firstName,
      lastName,
      phone,
      email,
      major,
      photoURL
    } = this.props.pledge;

    const {
      open,
      meritsRemaining,
      handleClose,
      handleRequestOpen,
      actions
    } = this.props;
    const fullName = `${firstName} ${lastName}`;

    const isIPhone = navigator.userAgent.match(/iPhone/i);

    if (isMobileDevice()) {
      return (
        <FullscreenDialog
          title={fullName}
          titleStyle={{ fontSize:'22px' }}
          style={{ backgroundColor: 'var(--background-color)' }}
          open={open}
          onRequestClose={handleClose}
        >
          <Tabs 
            className="garnett-tabs"
            value={this.state.index}
            onChange={this.handleChange}
          >
            <Tab style={getTabStyle(this.state.index === 0)} label="Info" value={0} />
            <Tab style={getTabStyle(this.state.index === 1)} label="Merits" value={1} />
          </Tabs>
          <SwipeableViews
            containerStyle={slideContainer}
            slideStyle={isIPhone && { overflow: 'scroll' }}
            index={this.state.index}
            onChangeIndex={this.handleChange}
            animateHeight
          >
            <div>
              <UserInfo
                photoURL={photoURL}
                meritsRemaining={meritsRemaining}
                phone={phone}
                email={email}
                major={major}
              />
            </div>
            <LoadableMeritsList
              pledgeName={firstName + lastName}
              handleRequestOpen={handleRequestOpen}
            />
          </SwipeableViews>
        </FullscreenDialog>
      )
    }

    return (
      <Dialog
        title={fullName}
        titleClassName="garnett-dialog-title"
        actions={actions}
        modal={false}
        bodyClassName="garnett-dialog-body tabs grey"
        contentClassName="garnett-dialog-content"
        open={open}
        onRequestClose={handleClose}
        autoScrollBodyContent={true}
      >
        <Tabs
          className="garnett-tabs"
          inkBarStyle={inkBarStyle}
          value={this.state.index}
          onChange={this.handleChange}
        >
          <Tab style={getTabStyle(this.state.index === 0)} label="Info" value={0}>
            <UserInfo
              photoURL={photoURL}
              meritsRemaining={meritsRemaining}
              phone={phone}
              email={email}
              major={major}
            />
          </Tab>
          <Tab style={getTabStyle(this.state.index === 1)} label="Merits" value={1}>
            <LoadableMeritsList
              pledgeName={firstName + lastName}
              handleRequestOpen={handleRequestOpen}
            />
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}
