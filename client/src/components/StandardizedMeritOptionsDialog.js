// @flow

import React, { Fragment } from 'react';
import { BottomSheet } from 'helpers/BottomSheet';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const MERIT_OPTIONS = [
  { reason: 'PC Merits', amount: '5', action: 'merit' },
  { reason: 'Good Interview', amount: '30', action: 'merit' },
  { reason: 'Standard Interview', amount: '25', action: 'merit' },
  { reason: 'Family Night Merits', amount: '20', action: 'merit' }
];

const DEMERIT_OPTIONS = [
  { reason: 'Late Greet', amount: '5', action: 'demerit' },
  { reason: 'Missed Greet', amount: '10', action: 'demerit' },
  { reason: 'Missed Text Reminder', amount: '20', action: 'demerit' },
  { reason: 'Rude to Active', amount: '15', action: 'demerit' },
  { reason: 'Asking for/ Complaining about Merits', amount: '15', action: 'demerit' }
];

type Props = {
  isMobile: boolean,
  open: boolean,
  selectStandardizedMeritOption: ({ reason: string, amount: number }) => void,
  handleClose: () => void
};

export function StandardizedMeritOptionsDialog(props: Props) {
  const body = (
    <Fragment>
      <List>
        <Subheader>Merit reasons</Subheader>
        {MERIT_OPTIONS.map((option) => (
          <ListItem
            key={option.reason}
            primaryText={option.reason}
            hoverColor="#f1f1f1"
            onClick={() => props.selectStandardizedMeritOption(option)}
          />
        ))}
      </List>
        <Divider />
      <List>
        <Subheader>Demerit reasons</Subheader>
        {DEMERIT_OPTIONS.map((option) => (
          <ListItem
            key={option.reason}
            primaryText={option.reason}
            hoverColor="#f1f1f1"
            onClick={() => props.selectStandardizedMeritOption(option)}
          />
        ))}
      </List>
    </Fragment>
  )

  if (props.isMobile) {
    return (
      <BottomSheet
        open={props.open}
        onRequestClose={props.handleClose}
      >
        { body }
      </BottomSheet>
    )
  }
  return (
    <Dialog
      contentClassName="garnett-dialog-content"
      open={props.open}
      onRequestClose={props.handleClose}
      autoScrollBodyContent={true}
    >
      { body }
    </Dialog>
  )
}
