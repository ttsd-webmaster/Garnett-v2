// @flow

import { isMobile } from 'helpers/functions.js';
import { UserInfo } from 'components';
import type { User } from 'api/models';

import React, { type Node } from 'react';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

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
      <FullscreenDialog
        title="Pledge Brother"
        titleStyle={{ fontSize:'22px' }}
        style={{ backgroundColor: 'var(--background-color)' }}
        open={props.open}
        onRequestClose={props.handleClose}
      >
        <UserInfo user={props.pledge} name={fullName} />
      </FullscreenDialog>
    )
  }
  return (
    <Dialog
      title="Pledge Brother"
      titleClassName="garnett-dialog-title"
      actions={props.actions}
      modal={false}
      bodyClassName="garnett-dialog-body list"
      contentClassName="garnett-dialog-content"
      open={props.open}
      onRequestClose={props.handleClose}
      autoScrollBodyContent={true}
    >
      <UserInfo user={props.pledge} name={fullName} />
    </Dialog>
  )
}
