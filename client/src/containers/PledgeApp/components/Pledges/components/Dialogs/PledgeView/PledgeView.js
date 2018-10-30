import { isMobileDevice } from 'helpers/functions.js';

import React from 'react';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

export function PledgeView(props) {
  const {
    firstName,
    lastName,
    phone,
    email,
    major,
    totalMerits,
    photoURL
  } = props.pledge;
  const fullName = `${firstName} ${lastName}`;

  return (
    isMobileDevice() ? (
      <FullscreenDialog
        title={fullName}
        titleStyle={{fontSize:'22px'}}
        open={props.open}
        onRequestClose={props.handleClose}
      >
        <img className="dialog-photo" src={photoURL} alt="User" />
        <List>
          <Divider />
          <ListItem
            className="garnett-list-item"
            primaryText="Total Merits"
            secondaryText={`${totalMerits} merits`}
            leftIcon={
              <i className="icon-star garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <a style={props.phoneStyle} href={`tel:${phone}`}>
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
      </FullscreenDialog>
    ) : (
      <Dialog
        title={fullName}
        titleClassName="garnett-dialog-title"
        actions={props.actions}
        modal={false}
        bodyClassName="contacts-dialog-body"
        contentClassName="garnett-dialog-content"
        open={props.open}
        onRequestClose={props.handleClose}
        autoScrollBodyContent={true}
      >
        <img className="dialog-photo" src={photoURL} alt="User" />
        <List>
          <Divider />
          <ListItem
            className="garnett-list-item"
            primaryText="Total Merits"
            secondaryText={`${totalMerits} merits`}
            leftIcon={
              <i className="icon-star garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <a style={props.phoneStyle} href={`tel:${phone}`}>
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
      </Dialog>
    )
  )
}