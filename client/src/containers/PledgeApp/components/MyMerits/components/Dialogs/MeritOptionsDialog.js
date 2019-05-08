// @flow

import { isMobile } from 'helpers/functions';
import { BottomSheet } from 'helpers/BottomSheet';

import React, { Fragment } from 'react';
import Dialog from 'material-ui/Dialog';
import { ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import FontIcon from 'material-ui/FontIcon';

type Props = {
  open: boolean,
  handleEditOpen: () => void,
  handleClose: () => void
};

export default function MeritOptionsDialog(props: Props) {
  const { open, handleEditOpen, handleClose } = props;
  const body = (
    <Fragment>
      <Subheader>Merit Options</Subheader>
      <ListItem
        leftIcon={<FontIcon className="icon-calendar-plus-o" />}
        primaryText="Edit Date"
        hoverColor="var(--hover-color)"
        onClick={() => handleEditOpen('edit')}
      />
      <ListItem
        leftIcon={<FontIcon className="icon-trash-empty" />}
        primaryText="Delete Merit"
        hoverColor="var(--hover-color)"
        onClick={() => handleEditOpen('delete')}
      />
    </Fragment>
  );

  if (isMobile()) {
    return (
      <BottomSheet open={open} onRequestClose={handleClose}>
        { body }
      </BottomSheet>
    )
  }

  return (
    <Dialog
      contentClassName="garnett-dialog-content"
      open={open}
      onRequestClose={handleClose}
    >
      { body }
    </Dialog>
  )
}
