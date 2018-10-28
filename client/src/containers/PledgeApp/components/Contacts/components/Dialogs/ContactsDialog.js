import { isMobileDevice } from 'helpers/functions.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const activePhoneNumber = {
  display: 'block',
  textDecoration: 'none'
}

export default class ContactsDialog extends Component {
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

    return (
      this.props.active && (
        isMobileDevice() ? (
          <FullscreenDialog
            title={fullName}
            titleStyle={{fontSize:'22px'}}
            open={this.props.open}
            onRequestClose={this.props.handleClose}
          >
            <img className="contacts-photo" src={photoURL} alt="User" />
            <List className="contacts-list">
              <Divider />
              <ListItem
                className="garnett-list-item"
                primaryText="Class"
                secondaryText={className}
                leftIcon={
                  <i className="icon-users garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" inset={true} />
              <a style={activePhoneNumber} href={`tel:${phone}`}>
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
            actions={actions}
            modal={false}
            bodyClassName="contacts-dialog-body"
            contentClassName="garnett-dialog-content"
            open={this.props.open}
            onRequestClose={this.props.handleClose}
            autoScrollBodyContent={true}
          >
            <img className="contacts-photo" src={photoURL} alt="User" />
            <List className="contacts-list">
              <Divider />
              <ListItem
                className="garnett-list-item"
                primaryText="Class"
                secondaryText={className}
                leftIcon={
                  <i className="icon-users garnett-icon"></i>
                }
              />
              <Divider className="garnett-divider" inset={true} />
              <a style={activePhoneNumber} href={`tel:${phone}`}>
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
    )
  }
}