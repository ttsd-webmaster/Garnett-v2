import { getTabStyle, isMobileDevice } from 'helpers/functions.js';
import { UserInfo } from 'components';
import { MeritsList } from './MeritsList';

import React, { PureComponent } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';
import SwipeableViews from 'react-swipeable-views';

const fullscreenDialogStyle = {
  backgroundColor: 'var(--background-color)',
  overflow: 'auto'
};

const slideContainer = {
  minHeight: 'calc(100vh - 112px)',
  WebkitOverflowScrolling: 'touch' // iOS momentum scrolling
};

const inkBarStyle = {
  position: 'fixed',
  bottom: 'auto',
  zIndex: 2
};

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

    if (isMobileDevice()) {
      return (
        <FullscreenDialog
          title={fullName}
          titleStyle={{ fontSize: '22px' }}
          style={fullscreenDialogStyle}
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
            <MeritsList
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
            <MeritsList
              pledgeName={firstName + lastName}
              handleRequestOpen={handleRequestOpen}
            />
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}
