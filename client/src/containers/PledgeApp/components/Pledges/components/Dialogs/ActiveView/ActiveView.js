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
  marginTop: '46px',
  backgroundColor: 'var(--primary-color)',
  zIndex: 2
};

const slideContainer = {
  marginTop: '48px',
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

  handleChange = (index) => {
    this.setState({ index });
  }

  handleClose = () => {
    this.props.handleClose();
    this.setState({ index: 0 });
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
    const fullName = `${firstName} ${lastName}`;

    return (
      isMobileDevice() ? (
        <FullscreenDialog
          title={fullName}
          titleStyle={{fontSize:'22px'}}
          open={this.props.open}
          onRequestClose={this.handleClose}
        >
          <Tabs 
            className="garnett-dialog-tabs"
            inkBarStyle={inkBarStyle}
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
              <img className="dialog-photo" src={photoURL} alt="User" />
              <List>
                <Divider />
                <ListItem
                  className="garnett-list-item"
                  primaryText="Merits Remaining"
                  secondaryText={`${this.props.meritsRemaining} merits`}
                  leftIcon={
                    <i className="icon-star garnett-icon"></i>
                  }
                />
                <Divider className="garnett-divider" inset={true} />
                <a style={this.props.phoneStyle} href={`tel:${phone}`}>
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
            </div>
            <LoadableMeritsList
              pledgeName={firstName + lastName}
              handleRequestOpen={this.props.handleRequestOpen}
            />
          </SwipeableViews>
        </FullscreenDialog>
      ) : (
        <Dialog
          title={fullName}
          titleClassName="garnett-dialog-title"
          actions={this.props.actions}
          modal={false}
          bodyClassName="garnett-dialog-body tabs grey"
          contentClassName="garnett-dialog-content"
          open={this.props.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <Tabs
            className="garnett-dialog-tabs"
            inkBarStyle={inkBarStyle}
            onChange={this.handleChange}
          >
            <Tab style={getTabStyle(this.state.index === 0)} label="Info" value={0}>
              <img className="dialog-photo" src={photoURL} alt="User" />
              <List>
                <Divider />
                <ListItem
                  className="garnett-list-item"
                  primaryText="Merits Remaining"
                  secondaryText={`${this.props.meritsRemaining} merits`}
                  leftIcon={
                    <i className="icon-star garnett-icon"></i>
                  }
                />
                <Divider className="garnett-divider" inset={true} />
                <a style={this.props.phoneStyle} href={`tel:${phone}`}>
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
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </Tab>
          </Tabs>
        </Dialog>
      )
    )
  }
}
