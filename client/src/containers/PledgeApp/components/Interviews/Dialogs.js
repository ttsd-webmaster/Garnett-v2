// @flow

import API from 'api/API.js';
import {
  isMobile,
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions.js';
import { OptionsDialog } from 'components/OptionsDialog';
import { LoadableMeritDialog } from '../Sidebar/Dialogs';
import { LoadableMobileMeritDialog } from '../MyMerits/components/Dialogs';
import type { User } from 'api/models';

import React, { Fragment, PureComponent } from 'react';

type Props = {
  open: boolean,
  state: User,
  user: User,
  fetchInterviewProgress: () => void,
  handleClose: () => void,
  handleRequestOpen: () => void
};

export class Dialogs extends PureComponent<Props> {
  state = { openMerit: false };

  get meritDialog() {
    const { state, user, handleRequestOpen } = this.props;
    if (isMobile()) {
      return (
        <LoadableMobileMeritDialog
          open={this.state.openMerit}
          type="interview"
          state={state}
          initialUser={user}
          handleMeritClose={this.handleMeritClose}
          handleRequestOpen={handleRequestOpen}
        />
      )
    }
    return (
      <LoadableMeritDialog
        open={this.state.openMerit}
        type="interview"
        state={state}
        initialUser={user}
        handleMeritClose={this.handleMeritClose}
        handleRequestOpen={handleRequestOpen}
      />
    );
  }

  deleteInterview = (user: User) => {
    const { firstName, lastName, status } = this.props.state;
    const fullName = `${firstName} ${lastName}`;
    const selectedUserName = `${user.firstName} ${user.lastName}`;
    const activeName = status === 'pledge' ? selectedUserName : fullName;
    const pledgeName = status === 'pledge' ? fullName : selectedUserName;
    API.deleteInterview(activeName, pledgeName)
    .then((res) => {
      this.props.fetchInterviewProgress();
      this.props.handleClose();
    })
    .catch(err => console.error(err));
  }

  handleMeritOpen = () => {
    this.setState({ openMerit: true });
    if (navigator.onLine) {
      iosFullscreenDialogOpen();
      androidBackOpen(this.handleMeritClose);
      this.props.handleClose();
      this.setState({ openMerit: true });
    } else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    androidBackClose();
    this.setState({ openMerit: false }, () => {
      iosFullscreenDialogClose();
    });
  }

  render() {
    const { open, user, handleClose } = this.props;
    const OPTIONS = [
      {
        header: 'Options',
        choices: [
          {
            text: 'Add merits',
            icon: 'icon-star',
            onClick: () => this.handleMeritOpen()
          },
          {
            text: 'Delete interview',
            icon: 'icon-trash-empty',
            onClick: () => this.deleteInterview(user)
          }
        ]
      }
    ];
    return (
      <Fragment>
        <OptionsDialog
          open={open}
          options={OPTIONS}
          handleClose={handleClose}
        />
        {this.meritDialog}
      </Fragment>
    );
  }
};
