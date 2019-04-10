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
  handleRequestOpen: () => void,
  actions: Node
};

type State = {
  index: number
};

export class ActiveView extends PureComponent<Props, State> {
  state = { index: 0 };

  get meritsList(): Node {
    const { firstName, lastName } = this.props.pledge;
    return (
      <MeritsList
        pledgeName={firstName + lastName}
        handleRequestOpen={this.props.handleRequestOpen}
      />
    )
  }

  handleChange = (index: number) => {
    this.setState({ index });
  }

  handleClose = () => {
    this.props.handleClose();
    this.setState({ index: 0 });
  }

  render() {
    const { pledge, remainingMerits, open, actions } = this.props;
    const { firstName, lastName } = pledge;
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
            disableLazyLoading
          >
            <div>
              <UserInfo
                user={pledge}
                name={fullName}
                remainingMerits={remainingMerits}
              />
            </div>
            { this.meritsList }
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
          value={this.state.index}
          onChange={this.handleChange}
        >
          <Tab style={getTabStyle(this.state.index === 0)} label="Info" value={0}>
            <UserInfo
              user={pledge}
              name={fullName}
              remainingMerits={remainingMerits}
            />
          </Tab>
          <Tab style={getTabStyle(this.state.index === 1)} label="Merits" value={1}>
            { this.meritsList }
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}
