// @flow

import { isMobile } from 'helpers/functions.js';
import { FullScreenDialog, UserInfo } from 'components';
import type { User } from 'api/models';

import React, { type Node } from 'react';
import Dialog from 'material-ui/Dialog';

type Props = {
  pledge: User,
  open: boolean,
  actions: Node,
  handleClose: () => void
};

export function PledgeView(props: Props) {
  const { firstName, lastName } = props.pledge;
  const fullName = `${firstName} ${lastName}`;
  if (isMobile()) {
    return (
      <FullScreenDialog
        title="Pledge Brother"
        open={props.open}
        onRequestClose={props.handleClose}
      >
        <UserInfo user={props.pledge} name={fullName} />
      </FullScreenDialog>
    )
  }
  return (
    <Dialog
      title="Pledge Brother"
      titleClassName="garnett-dialog-title"
      actions={props.actions}
      bodyClassName="garnett-dialog-body list"
      contentClassName="garnett-dialog-content"
      open={props.open}
      onRequestClose={props.handleClose}
      autoDetectWindowHeight={false}
    >
      <UserInfo user={props.pledge} name={fullName} />
    </Dialog>
  )
}
