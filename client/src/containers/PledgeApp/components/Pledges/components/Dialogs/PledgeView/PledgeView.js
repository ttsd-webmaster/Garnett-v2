import { isMobileDevice } from 'helpers/functions.js';
import { UserInfo } from 'components';

import React from 'react';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

export function PledgeView({
  pledge,
  open,
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
        <UserInfo
          photoURL={photoURL}
          totalMerits={totalMerits}
          phone={phone}
          email={email}
          major={major}
        />
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
      <UserInfo
        photoURL={photoURL}
        totalMerits={totalMerits}
        phone={phone}
        email={email}
        major={major}
      />
    </Dialog>
  )
}
