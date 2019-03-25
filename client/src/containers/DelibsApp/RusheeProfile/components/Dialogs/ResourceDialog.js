// @flow

import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const bodyStyle = {
  padding: 0
};

const contentStyle = {
  height: '100vh',
  width: '100vw'
};

type Props = {
  open: boolean,
  resource: string,
  resourceName: string,
  handleClose: () => void
};

export function ResourceDialog(props: Props) {
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={props.handleClose}
    />,
  ];

  return (
    <Dialog
      actions={actions}
      bodyStyle={bodyStyle}
      contentStyle={contentStyle}
      modal={false}
      open={props.open}
      onRequestClose={props.handleClose}
      autoScrollBodyContent={true}
    >
      <img src={props.resource} width="100%" alt={props.resourceName} />
    </Dialog>
  )
}
