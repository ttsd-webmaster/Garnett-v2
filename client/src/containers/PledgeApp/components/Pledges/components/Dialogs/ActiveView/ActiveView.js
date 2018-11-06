import './ActiveView.css';
import { getTabStyle, isMobileDevice } from 'helpers/functions.js';

import React, { PureComponent } from 'react';
import Loadable from 'react-loadable';
import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
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
      phoneStyle,
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
          open={open}
          onRequestClose={handleClose}
        >
          <Tabs
            className="garnett-tabs"
            inkBarStyle={isIPhone && inkBarStyle}
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
              <img className="dialog-photo" src={photoURL} alt="User" />
              <List>
                <Divider className="garnett-divider" />
                <ListItem
                  className="garnett-list-item"
                  primaryText={<p className="garnett-name">Merits Remaining</p>}
                  secondaryText={
                    <p className="garnett-description">{meritsRemaining} merits</p>
                  }
                  leftIcon={<i className="icon-star garnett-icon"></i>}
                />
                <Divider className="garnett-divider" inset={true} />
                <a style={phoneStyle} href={`tel:${phone}`}>
                  <ListItem
                    className="garnett-list-item"
                    primaryText={<p className="garnett-name">Phone Number</p>}
                    secondaryText={<p className="garnett-description">{phone}</p>}
                    leftIcon={<i className="icon-phone garnett-icon"></i>}
                  />
                </a>
                <Divider className="garnett-divider" inset={true} />
                <ListItem
                  className="garnett-list-item"
                  primaryText={<p className="garnett-name">Email Address</p>}
                  secondaryText={<p className="garnett-description">{email}</p>}
                  leftIcon={<i className="icon-mail-alt garnett-icon"></i>}
                />
                <Divider className="garnett-divider" inset={true} />
                <ListItem
                  className="garnett-list-item"
                  primaryText={<p className="garnett-name">Major</p>}
                  secondaryText={<p className="garnett-description">{major}</p>}
                  leftIcon={<i className="icon-graduation-cap garnett-icon"></i>}
                />
                <Divider className="garnett-divider" />
              </List>
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
            <img className="dialog-photo" src={photoURL} alt="User" />
            <List>
              <Divider />
              <ListItem
                className="garnett-list-item"
                primaryText="Merits Remaining"
                secondaryText={`${meritsRemaining} merits`}
                leftIcon={
                  <i className="icon-star garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" inset={true} />
              <a style={phoneStyle} href={`tel:${phone}`}>
                <ListItem
                  className="garnett-list-item"
                  primaryText="Phone Number"
                  secondaryText={phone}
                  leftIcon={
                    <i className="icon-phone garnett-icon"></i>
                  }
                />
              </a>
              <Divider className="garnett-divider" inset={true} />
              <ListItem
                className="garnett-list-item"
                primaryText="Email Address"
                secondaryText={email}
                leftIcon={
                  <i className="icon-mail-alt garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" inset={true} />
              <ListItem
                className="garnett-list-item"
                primaryText="Major"
                secondaryText={major}
                leftIcon={
                  <i className="icon-graduation-cap garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" />
            </List>
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
