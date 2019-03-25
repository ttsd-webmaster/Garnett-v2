// @flow

import { isMobile } from 'helpers/functions.js';
import { UserInfo } from 'components';
import type { User } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

type Props = {
  pledge: User,
  open: boolean,
  actions: Node,
  handleClose: () => void
};

export class PledgeView extends PureComponent<Props> {
  get userInfo(): Node {
    const { pledge } = this.props;
    return (
      <UserInfo
        photoURL={pledge.photoURL}
        totalMerits={pledge.totalMerits}
        phone={pledge.phone}
        email={pledge.email}
        major={pledge.major}
      />
    )
  }

  render() {
    const { firstName, lastName } = this.props.pledge;
    const fullName = `${firstName} ${lastName}`;
    if (isMobile()) {
      return (
        <FullscreenDialog
          title={fullName}
          titleStyle={{ fontSize:'22px' }}
          style={{ backgroundColor: 'var(--background-color)' }}
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
        actions={this.props.actions}
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
