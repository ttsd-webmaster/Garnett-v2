import { isMobile } from 'helpers/functions.js';
import { UserInfo } from 'components';

import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const fullscreenDialogStyle = {
  backgroundColor: 'var(--background-color)',
  overflow: 'auto'
};

export default function ContactsDialog({
  active,
  open,
  handleClose
}) {
  const {
    firstName,
    lastName,
    phone,
    email,
    major,
    photoURL,
    class: className,
  } = active;
  const fullName = `${firstName} ${lastName}`;

  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={handleClose}
    />,
  ];

  if (!active) {
    return null
  }

  if (isMobile()) {
    return (
      <FullscreenDialog
        title={fullName}
        titleStyle={{ fontSize:'22px' }}
        style={fullscreenDialogStyle}
        open={open}
        onRequestClose={handleClose}
      >
        <UserInfo
          photoURL={photoURL}
          className={className}
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
        className={className}
        phone={phone}
        email={email}
        major={major}
      />
    </Dialog>
  )
}
