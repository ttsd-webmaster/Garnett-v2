import 'containers/PledgeApp/components/Settings/Settings.css';
import API from 'api/API.js';
import { androidBackOpen, androidBackClose } from 'helpers/functions.js';
import {
  LoadableVoteDialog,
  LoadableEndVoteDialog,
  LoadableResourceDialog,
  LoadableInterviewDialog
} from './Dialogs';

import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { BottomSheet } from 'helpers/BottomSheet/index.js';

export class RusheeProfileButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openEndVote: false,
      resource: '',
      sheetOpen: false,
      openResource: false,
      openInterview: false
    };
  }

  startVote = () => {
    const rusheeName = this.props.rushee.name;

    API.startVote(rusheeName)
    .then((res) => {
      console.log('Started Vote');
      this.setState({ openEndVote: true });
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
  }

  closeEndVote = () => {
    this.setState({ openEndVote: false });
  }

  viewResource = (resource) => {
    androidBackOpen(this.closeResource);
    this.setState({
      sheetOpen: false,
      openResource: true,
      resource
    });
  }

  closeResource = () => {
    androidBackClose();
    this.setState({ openResource: false });
  }

  viewInterview = () => {
    const appBar = document.querySelector('.app-header');

    appBar.style.zIndex = 0;
    androidBackOpen(this.closeInterview);

    this.setState({
      sheetOpen: false,
      openInterview: true
    });
  }

  closeInterview = () => {
    const appBar = document.querySelector('.app-header');

    appBar.style.zIndex = 1;
    androidBackClose();

    this.setState({ openInterview: false });
  }

  render() {
    return (
      this.props.state.status === 'regent' ? (
        <div>
          <div className="logout-button" onClick={this.startVote}> Start Vote </div>

          <LoadableEndVoteDialog
            open={this.state.openEndVote}
            rushee={this.props.rushee.name}
            handleClose={this.closeEndVote}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      ) : (
        <div>
          <BottomSheet
            open={this.state.sheetOpen}
            onRequestClose={() => this.setState({sheetOpen: false})}
          >
            <Subheader> Open </Subheader>
            <List>
              <ListItem primaryText="Resume" onClick={() => this.viewResource('resume')} />
              <ListItem primaryText="Degree Audit" onClick={() => this.viewResource('degreeAudit')} />
              <ListItem primaryText="Schedule" onClick={() => this.viewResource('schedule')} />
              <ListItem primaryText="Interview Responses" onClick={this.viewInterview} />
              <a style={{textDecoration:'none'}} href={this.props.rushee.preDelibs} target="_blank">
                <ListItem primaryText="Pre-Delibs Sheet"/>
              </a>
            </List>
          </BottomSheet>

          <div 
            className="logout-button"
            onClick={() => this.setState({sheetOpen: true})}
          >
            Resources 
          </div>
          
          <LoadableResourceDialog
            open={this.state.openResource}
            resource={this.props.rushee.resources[this.state.resource]}
            resourceName={this.state.resource}
            handleClose={this.closeResource}
          />
          <LoadableInterviewDialog
            open={this.state.openInterview}
            rushee={this.props.rushee}
            handleClose={this.closeInterview}
          />
          <LoadableVoteDialog
            state={this.props.state}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      )
    )
  }
}
