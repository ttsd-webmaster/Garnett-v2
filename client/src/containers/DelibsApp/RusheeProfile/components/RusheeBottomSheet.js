// @flow

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { BottomSheet } from 'helpers/BottomSheet/index.js';

import React from 'react';

type Props = {
  sheetOpen: boolean,
  closeBottomSheet: () => void,
  viewResource: (string) => void,
  viewInterview: () => void,
  preDelibs: string
};

export function RusheeBottomSheet(props: Props) {
  const {
    sheetOpen,
    closeBottomSheet,
    viewResource,
    viewInterview,
    preDelibs
  } = props;
  return (
    <BottomSheet
      open={sheetOpen}
      onRequestClose={closeBottomSheet}
    >
      <Subheader>Open</Subheader>
      <List>
        <ListItem primaryText="Resume" onClick={() => viewResource('resume')} />
        <ListItem primaryText="Degree Audit" onClick={() => viewResource('degreeAudit')} />
        <ListItem primaryText="Schedule" onClick={() => viewResource('schedule')} />
        <ListItem primaryText="Interview Responses" onClick={viewInterview} />
        <a style={{ textDecoration:'none' }} href={preDelibs} target="_blank">
          <ListItem primaryText="Pre-Delibs Sheet"/>
        </a>
      </List>
    </BottomSheet>
  )
}
