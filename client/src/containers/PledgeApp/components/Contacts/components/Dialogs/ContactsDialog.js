// @flow

import { isMobile } from 'helpers/functions.js';
import { UserInfo } from 'components';
import type { User } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const fullscreenDialogStyle = {
  backgroundColor: 'var(--background-color)',
  overflow: 'auto'
};

type Props = {
  active: User,
  open: boolean,
  handleClose: () => void
};

export default class ContactsDialog extends PureComponent<Props> {
  get userInfo(): Node {
    const { active } = this.props;
    return (
      <UserInfo
        photoURL={active.photoURL}
        className={active.class}
        phone={active.phone}
        email={active.email}
        major={active.major}
      />
    )
  }

  render() {
    const { firstName, lastName } = this.props.active;
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

    if (isMobile()) {
      return (
        <FullscreenDialog
          title={fullName}
          titleStyle={{ fontSize:'22px' }}
          style={fullscreenDialogStyle}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          { this.userInfo }
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
        { this.userInfo }
      </Dialog>
    )
  }
}
