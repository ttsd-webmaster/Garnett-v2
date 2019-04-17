// @flow

import API from 'api/API.js';
import { androidBackOpen, androidBackClose } from 'helpers/functions.js';
import {
  LoadableVoteDialog,
  LoadableEndVoteDialog,
  LoadableResourceDialog,
  LoadableInterviewDialog
} from './Dialogs';
import { RusheeBottomSheet } from './RusheeBottomSheet';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';

type Props = {
  rushee: Object,
  state: User,
  handleRequestOpen: () => void
};

type State = {
  openEndVote: boolean,
  resource: string,
  sheetOpen: boolean,
  openResource: boolean,
  openInterview: boolean
};

export class RusheeProfileButton extends PureComponent<Props, State> {
  state = {
    openEndVote: false,
    resource: '',
    sheetOpen: false,
    openResource: false,
    openInterview: false
  };

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

  viewResource = (resource: string) => {
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

  openBottomSheet = () => {
    this.setState({ sheetOpen: true });
  }

  closeBottomSheet = () => {
    this.setState({ sheetOpen: false });
  }

  render() {
    if (this.props.state.status === 'regent') {
      return (
        <div>
          <div className="logout-button" onClick={this.startVote}> Start Vote </div>
          <LoadableEndVoteDialog
            open={this.state.openEndVote}
            rushee={this.props.rushee.name}
            handleClose={this.closeEndVote}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      )
    }
    
    return (
      <div>
        <RusheeBottomSheet
          sheetOpen={this.state.sheetOpen}
          preDelibs={this.props.rushee.preDelibs}
          viewResource={this.viewResource}
          viewInterview={this.viewInterview}
          closeBottomSheet={this.closeBottomSheet}
        />
        <div 
          className="logout-button"
          onClick={this.openBottomSheet}
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
  }
}
