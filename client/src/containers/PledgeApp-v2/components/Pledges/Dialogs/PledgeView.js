import {isMobileDevice} from 'helpers/functions.js';

import React from 'react';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

export function PledgeView(props) {
  return (
    isMobileDevice() ? (
      <FullscreenDialog
        title="Pledge"
        titleStyle={{fontSize:'22px'}}
        open={props.open}
        onRequestClose={props.handleClose}
      >
        <div style={{padding:'15px 0'}}>
          <img className="dialog-photo" src={props.pledge.photoURL} alt="User" />
        </div>
        <List>
          <Divider />
          <ListItem
            className="garnett-list-item"
            primaryText="Name"
            secondaryText={props.pledgeName}
            leftIcon={
              <i className="icon-user garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <a style={props.activePhoneNumber} href={`tel:${props.pledge.phone}`}>
            <ListItem
              className="contacts-list-item"
              primaryText="Phone Number"
              secondaryText={props.pledge.phone}
              leftIcon={
                <i className="icon-phone garnett-icon"></i>
              }
            />
          </a>
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="garnett-list-item"
            primaryText="Email Address"
            secondaryText={props.pledge.email}
            leftIcon={
              <i className="icon-mail-alt garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="garnett-list-item"
            primaryText="Major"
            secondaryText={props.pledge.major}
            leftIcon={
              <i className="icon-graduation-cap garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="garnett-list-item"
            primaryText="Total Merits"
            secondaryText={`${props.totalMerits} merits`}
            leftIcon={
              <i className="icon-star garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" />
        </List>
      </FullscreenDialog>
    ) : (
      <Dialog
        actions={props.actions}
        modal={false}
        bodyClassName="contacts-dialog-body"
        contentClassName="garnett-dialog-content"
        open={props.open}
        onRequestClose={props.handleClose}
        autoScrollBodyContent={true}
      >
        <img className="contacts-photo" src={props.pledge.photoURL} alt="User" />
        <List>
          <Divider />
          <ListItem
            className="contacts-list-item"
            primaryText="Name"
            secondaryText={props.pledgeName}
            leftIcon={
              <i className="icon-user garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <a style={props.activePhoneNumber} href={`tel:${props.pledge.phone}`}>
            <ListItem
              className="contacts-list-item"
              primaryText="Phone Number"
              secondaryText={props.pledge.phone}
              leftIcon={
                <i className="icon-phone garnett-icon"></i>
              }
            />
          </a>
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="contacts-list-item"
            primaryText="Email Address"
            secondaryText={props.pledge.email}
            leftIcon={
              <i className="icon-mail-alt garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="contacts-list-item"
            primaryText="Major"
            secondaryText={props.pledge.major}
            leftIcon={
              <i className="icon-graduation-cap garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" inset={true} />
          <ListItem
            className="contacts-list-item"
            primaryText="Total Merits"
            secondaryText={`${props.pledge.totalMerits} merits`}
            leftIcon={
              <i className="icon-star garnett-icon"></i>
            }
          />
          <Divider className="garnett-divider" />
        </List>
      </Dialog>
    )
  )
}