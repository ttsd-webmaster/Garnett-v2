import '../Contacts.css';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const activePhoneNumber = {
  display: 'block',
  textDecoration: 'none'
}

export default class ContactsDialog extends Component {
  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />,
    ];

    return (
      this.props.active &&
      <Dialog
        actions={actions}
        modal={false}
        bodyClassName="contacts-dialog-body"
        contentClassName="contacts-dialog-content"
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        <img className="contacts-photo" src={this.props.active.photoURL} alt="User" />
        <List className="contacts-list">
          <Divider />
          <ListItem
            className="contacts-list-item"
            primaryText="Name"
            secondaryText={
              <p> {this.props.active.firstName} {this.props.active.lastName} </p>
            }
            leftIcon={
              <i className="icon-user garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <a style={activePhoneNumber} href={`tel:${this.props.active.phone}`}>
            <ListItem
              className="contacts-list-item"
              primaryText="Phone Number"
              secondaryText={this.props.active.phone}
              leftIcon={
                <i className="icon-phone garnett-icon"></i>
              }
            />
          </a>
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="contacts-list-item"
            primaryText="Email Address"
            secondaryText={this.props.active.email}
            leftIcon={
              <i className="icon-mail-alt garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="contacts-list-item"
            primaryText="Class"
            secondaryText={this.props.active.class}
            leftIcon={
              <i className="icon-users garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="contacts-list-item"
            primaryText="Major"
            secondaryText={this.props.active.major}
            leftIcon={
              <i className="icon-graduation-cap garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" />
        </List>
      </Dialog>
    )
  }
}