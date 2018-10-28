import {getTabStyle, isMobileDevice} from 'helpers/functions.js';

import React from 'react';
import Loadable from 'react-loadable';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const inkBarStyle = {
  position: 'fixed',
  bottom: 'auto',
  marginTop: '46px',
  backgroundColor: 'var(--primary-color)',
  zIndex: 2
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

export function ActiveView(props) {
  const {
    firstName,
    lastName,
    phone,
    email,
    major,
    photoURL,
  } = props.pledge;

  return (
    isMobileDevice() ? (
      <FullscreenDialog
        title="Pledge"
        titleStyle={{fontSize:'22px'}}
        open={props.open}
        onRequestClose={props.handleClose}
      >
        <Tabs 
          className="garnett-dialog-tabs"
          inkBarStyle={inkBarStyle}
          onChange={props.handleChange}
        >
          <Tab style={getTabStyle(props.index === 0)} label="Info" value={0}>
            <div style={{padding:'15px 0'}}>
              <img className="dialog-photo" src={photoURL} alt="User" />
            </div>
            <List>
              <Divider />
              <ListItem
                className="garnett-list-item"
                primaryText="Name"
                secondaryText={`${firstName} ${lastName}`}
                leftIcon={
                  <i className="icon-user garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" inset={true} />
              <a style={props.phoneStyle} href={`tel:${phone}`}>
                <ListItem
                  className="contacts-list-item"
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
              <Divider className="garnett-divider" inset={true} />
              <ListItem
                className="garnett-list-item"
                primaryText="Merits Remaining"
                secondaryText={`${props.meritsRemaining} merits`}
                leftIcon={
                  <i className="icon-star garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" />
            </List>
          </Tab>
          <Tab style={getTabStyle(props.index === 1)} label="Merits" value={1}>
            <LoadableMeritsList
              pledgeName={props.pledgeDisplayName}
              handleRequestOpen={props.handleRequestOpen}
            />
          </Tab>
        </Tabs>
      </FullscreenDialog>
    ) : (
      <Dialog
        title="Pledge"
        titleClassName="garnett-dialog-title"
        actions={props.actions}
        modal={false}
        bodyClassName="garnett-dialog-body tabs grey"
        contentClassName="garnett-dialog-content"
        open={props.open}
        onRequestClose={props.handleClose}
        autoScrollBodyContent={true}
      >
        <Tabs
          className="garnett-dialog-tabs"
          inkBarStyle={inkBarStyle}
          onChange={props.handleChange}
        >
          <Tab style={getTabStyle(props.index === 0)} label="Info" value={0}>
            <div style={{padding:'15px 0'}}>
              <img className="dialog-photo" src={photoURL} alt="User" />
            </div>
            <List>
              <Divider />
              <ListItem
                className="garnett-list-item"
                primaryText="Name"
                secondaryText={`${firstName} ${lastName}`}
                leftIcon={
                  <i className="icon-user garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" inset={true} />
              <a style={props.phoneStyle} href={`tel:${phone}`}>
                <ListItem
                  className="contacts-list-item"
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
              <Divider className="garnett-divider" inset={true} />
              <ListItem
                className="garnett-list-item"
                primaryText="Merits Remaining"
                secondaryText={`${props.meritsRemaining} merits`}
                leftIcon={
                  <i className="icon-star garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" />
            </List>
          </Tab>
          <Tab style={getTabStyle(props.index === 1)} label="Merits" value={1}>
            <LoadableMeritsList
              pledgeName={firstName + lastName}
              handleRequestOpen={props.handleRequestOpen}
            />
          </Tab>
        </Tabs>
      </Dialog>
    )
  )
}