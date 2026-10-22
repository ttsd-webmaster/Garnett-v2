// @flow

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
    const { open, handleClose } = this.props;
    const OPTIONS = [
      {
        header: 'Options',
        choices: [
          {
            text: 'Add merits',
            icon: 'icon-star',
            onClick: () => this.handleMeritOpen()
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
