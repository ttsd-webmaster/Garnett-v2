import 'containers/PledgeApp/components/Settings/Settings.css';
import API from 'api/API.js';
import { androidBackOpen, androidBackClose } from 'helpers/functions.js';
import {
  LoadableVoteDialog,
  LoadableEndVoteDialog,
  LoadableResourceDialog,
  LoadableInterviewDialog
} from './Dialogs';
import { RusheeBottomSheet } from './RusheeBottomSheet';

import React, { PureComponent } from 'react';

export class RusheeProfileButton extends PureComponent {
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

  openBottomSheet = () => {
    this.setState({ sheetOpen: true });
  }

  closeBottomSheet = () => {
    this.setState({ sheetOpen: false });
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
    )
  }
}
