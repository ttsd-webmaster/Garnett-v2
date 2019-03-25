// @flow

import { isMobile } from 'helpers/functions.js';
import { interviewResponses } from '../../data.js';

import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

type Props = {
  open: boolean,
  rushee: Object,
  handleClose: () => void
};

export function InterviewDialog(props: Props) {
  const actions = (
    <FlatButton
      label="Close"
      primary={true}
      onClick={props.handleClose}
    />
  );

  if (isMobile()) {
    return (
      <FullscreenDialog
        title="Interview Responses"
        open={props.open}
        onRequestClose={props.handleClose}
      >
        {props.rushee.rotate ? (
          <img className="user-photo rotate" src={props.rushee.photo} alt="Rushee" />
        ) : (
          <img className="user-photo" src={props.rushee.photo} alt="Rushee" />
        )}
        
        <List style={{padding:'24px 0'}}>
          {interviewResponses.map((response, i) => (
            <div key={i}>
              <Divider className="garnett-divider" />
              <ListItem
                className="garnett-list-item long"
                primaryText={response.label}
                secondaryText={props.rushee.interviewResponses[response.value]}
              />
              <Divider className="garnett-divider" />
            </div>
          ))}
        </List>
      </FullscreenDialog>
    )
  }

  return (
    <Dialog
      title="Interview Responses"
      titleClassName="garnett-dialog-title"
      actions={actions}
      modal={false}
      bodyClassName="garnett-dialog-body tabs grey"
      contentClassName="garnett-dialog-content"
      open={props.open}
      onRequestClose={props.handleClose}
      autoScrollBodyContent={true}
    >
      <List style={{padding:'24px 0'}}>
        {interviewResponses.map((response, i) => (
          <div key={i}>
            <Divider className="garnett-divider" />
            <ListItem
              className="garnett-list-item long"
              primaryText={response.label}
              secondaryText={props.rushee.interviewResponses[response.value]}
            />
            <Divider className="garnett-divider" />
          </div>
        ))}
      </List>
    </Dialog>
  )
}
