import {isMobileDevice} from 'helpers/functions.js';
import {interviewResponses} from '../data.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

export default class InterviewDialog extends Component {
  render() {
    const actions = (
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />
    );

    return (
      <div>
        {isMobileDevice() ? (
          <FullscreenDialog
            title="Interview Responses"
            open={this.props.open}
            onRequestClose={this.props.handleClose}
          >
            {this.props.rushee.rotate ? (
              <img className="user-photo rotate" src={this.props.rushee.photo} alt="Rushee" />
            ) : (
              <img className="user-photo" src={this.props.rushee.photo} alt="Rushee" />
            )}
            
            <List style={{padding:'24px 0'}}>
              {interviewResponses.map((response, i) => (
                <div key={i}>
                  <Divider className="garnett-divider" />
                  <ListItem
                    className="garnett-list-item long"
                    primaryText={response.label}
                    secondaryText={this.props.rushee.interviewResponses[response.value]}
                  />
                  <Divider className="garnett-divider" />
                </div>
              ))}
            </List>
          </FullscreenDialog>
        ) : (
          <Dialog
            title="Interview Responses"
            titleClassName="garnett-dialog-title"
            actions={actions}
            modal={false}
            bodyClassName="garnett-dialog-body tabs grey"
            contentClassName="garnett-dialog-content"
            open={this.props.open}
            onRequestClose={this.props.handleClose}
            autoScrollBodyContent={true}
          >
            <List style={{padding:'24px 0'}}>
              {interviewResponses.map((response, i) => (
                <div key={i}>
                  <Divider className="garnett-divider" />
                  <ListItem
                    className="garnett-list-item long"
                    primaryText={response.label}
                    secondaryText={this.props.rushee.interviewResponses[response.value]}
                  />
                  <Divider className="garnett-divider" />
                </div>
              ))}
            </List>
          </Dialog>
        )}
      </div>
    )
  }
}
