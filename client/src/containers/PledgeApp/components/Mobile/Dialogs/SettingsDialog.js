// @flow

import React from 'react';

import type { User } from 'api/models';
import { FullScreenDialog } from 'components/FullScreenDialog';
import { Settings } from 'containers/PledgeApp/components/Settings/Settings';

type Props = {
  state: User,
  open: boolean,
  history: RouterHistory,
  logOut: () => void,
  handleSettingsClose: () => void
};

export default function SettingsDialog(props: Props) {
  return (
    <FullScreenDialog
      title="Settings"
      open={props.open}
      onRequestClose={props.handleSettingsClose}
    >
      <Settings
        history={props.history}
        state={props.state}
        logOut={props.logOut}
      />
    </FullScreenDialog>
  );
};
