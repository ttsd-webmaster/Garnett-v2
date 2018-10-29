import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { BottomSheet } from 'helpers/BottomSheet/index.js';

import React from 'react';

export function RusheeBottomSheet(props) {
  return (
    <BottomSheet
      open={props.sheetOpen}
      onRequestClose={props.closeBottomSheet}
    >
      <Subheader>Open</Subheader>
      <List>
        <ListItem primaryText="Resume" onClick={() => props.viewResource('resume')} />
        <ListItem primaryText="Degree Audit" onClick={() => props.viewResource('degreeAudit')} />
        <ListItem primaryText="Schedule" onClick={() => props.viewResource('schedule')} />
        <ListItem primaryText="Interview Responses" onClick={props.viewInterview} />
        <a style={{ textDecoration:'none' }} href={props.preDelibs} target="_blank">
          <ListItem primaryText="Pre-Delibs Sheet"/>
        </a>
      </List>
    </BottomSheet>
  )
}
