// @flow

import { getTabStyle, isMobile } from 'helpers/functions.js';
import { UserInfo } from 'components';
import { MeritsList } from './MeritsList';
import type { User } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';
import SwipeableViews from 'react-swipeable-views';

const fullscreenDialogStyle = {
  backgroundColor: 'var(--background-color)',
  overflow: 'auto'
};

const slideContainer = {
  height: 'calc(100vh - 112px)',
  WebkitOverflowScrolling: 'touch' // iOS momentum scrolling
};

const inkBarStyle = {
  position: 'fixed',
  bottom: 'auto',
  zIndex: 2
};

type Props = {
  pledge: User,
  open: boolean,
  remainingMerits: number,
  handleClose: () => void,
  actions: Node
};

type State = {
  index: number
};

export class ActiveView extends PureComponent<Props, State> {
  state = { index: 0 };

  handleChange = (index: number) => {
    this.setState({ index });
  }

  handleClose = () => {
    this.props.handleClose();
    this.setState({ index: 0 });
  }

  render() {
    const { pledge, remainingMerits, open, actions } = this.props;
    const { index } = this.state;
    const { firstName, lastName, displayName } = pledge;
    const fullName = `${firstName} ${lastName}`;
    if (isMobile()) {
      return (
        <FullscreenDialog
          title="Pledge"
          titleStyle={{ fontSize: '22px' }}
          style={fullscreenDialogStyle}
          open={open}
          onRequestClose={this.handleClose}
        >
          <Tabs 
            className="garnett-tabs"
            value={index}
            onChange={this.handleChange}
          >
            <Tab style={getTabStyle(index === 0)} label="Info" value={0} />
            <Tab style={getTabStyle(index === 1)} label="Merits" value={1} />
          </Tabs>
          <SwipeableViews
            containerStyle={slideContainer}
            index={index}
            onChangeIndex={this.handleChange}
            disableLazyLoading
          >
            <div style={{ paddingBottom: '20px' }}>
              <UserInfo
                user={pledge}
                name={fullName}
                remainingMerits={remainingMerits}
              />
            </div>
            <MeritsList pledgeName={displayName} />
          </SwipeableViews>
        </FullscreenDialog>
      )
    }
    return (
      <Dialog
        title="Pledge"
        titleClassName="garnett-dialog-title"
        actions={actions}
        bodyClassName="garnett-dialog-body list"
        contentClassName="garnett-dialog-content"
        open={open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <Tabs
          className="garnett-tabs"
          inkBarStyle={inkBarStyle}
          value={index}
          onChange={this.handleChange}
        >
          <Tab style={getTabStyle(index === 0)} label="Info" value={0}>
            <UserInfo
              user={pledge}
              name={fullName}
              remainingMerits={remainingMerits}
            />
          </Tab>
          <Tab style={getTabStyle(index === 1)} label="Merits" value={1}>
            <MeritsList pledgeName={displayName} />
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}
