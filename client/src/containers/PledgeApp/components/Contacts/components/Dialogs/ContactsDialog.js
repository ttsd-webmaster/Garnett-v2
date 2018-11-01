import { isMobileDevice } from 'helpers/functions.js';

import React, { PureComponent} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const activePhoneNumber = {
  display: 'block',
  textDecoration: 'none'
}

export default class ContactsDialog extends PureComponent {
  render() {
    const {
      firstName,
      lastName,
      phone,
      email,
      major,
      photoURL,
      class: className,
    } = this.props.active;
    const fullName = `${firstName} ${lastName}`;

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />,
    ];

    if (!this.props.active) {
      return null
    }

    if (isMobileDevice()) {
      return (
        <FullscreenDialog
          title={fullName}
          titleStyle={{ fontSize:'22px' }}
          style={{ backgroundColor: 'var(--background-color' }}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          <img className="dialog-photo" src={photoURL} alt="User" />
          <List>
            <Divider className="garnett-divider" />
            <ListItem
              className="garnett-list-item"
              primaryText={<p className="garnett-name">Class</p>}
              secondaryText={<p className="garnett-description">{className}</p>}
              leftIcon={<i className="icon-users garnett-icon"></i>}
            />
            <Divider className="garnett-divider" inset={true} />
            <a style={activePhoneNumber} href={`tel:${phone}`}>
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
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        <img className="contacts-photo" src={photoURL} alt="User" />
        <List>
          <Divider />
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Class</p>}
            secondaryText={<p className="garnett-description">{className}</p>}
            leftIcon={<i className="icon-users garnett-icon"></i>}
          />
          <Divider className="garnett-divider" inset={true} />
          <a style={activePhoneNumber} href={`tel:${phone}`}>
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
      </Dialog>
    )
  }
}