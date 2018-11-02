import { isMobileDevice } from 'helpers/functions.js';

import React from 'react';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

export function PledgeView({
  pledge,
  open,
  phoneStyle,
  actions,
  handleClose
}) {
  const {
    firstName,
    lastName,
    phone,
    email,
    major,
    totalMerits,
    photoURL
  } = pledge;
  const fullName = `${firstName} ${lastName}`;

  if (isMobileDevice()) {
    return (
      <FullscreenDialog
        title={fullName}
        titleStyle={{ fontSize:'22px' }}
        style={{ backgroundColor: 'var(--background-color)' }}
        open={open}
        onRequestClose={handleClose}
      >
        <img className="dialog-photo" src={photoURL} alt="User" />
        <List>
          <Divider className="garnett-divider" />
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Total Merits</p>}
            secondaryText={<p className="garnett-description">{totalMerits}</p>}
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
      </FullscreenDialog>
    )
  }

  return (
    <Dialog
      title={fullName}
      titleClassName="garnett-dialog-title"
      actions={actions}
      modal={false}
      bodyClassName="contacts-dialog-body"
      contentClassName="garnett-dialog-content"
      open={open}
      onRequestClose={handleClose}
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
    </Dialog>
  )
}
