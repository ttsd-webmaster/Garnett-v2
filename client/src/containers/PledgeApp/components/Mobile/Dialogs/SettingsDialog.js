// @flow

import { Settings } from 'containers/PledgeApp/components/Settings/Settings';
import type { User } from 'api/models';

import React from 'react';
import { createPortal } from 'react-dom';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const titleStyle = {
  fontFamily: "'Helvetica Neue', Roboto, sans-serif",
  fontSize: '18px',
  fontWeight: '500',
  color: '--var(text-color)',
  marginRight: '38px',
  letterSpacing: '0.5px',
  textAlign: 'center'
};

type Props = {
  state: User,
  open: boolean,
  history: RouterHistory,
  logOut: () => void,
  handleSettingsClose: () => void
};

export default function SettingsDialog(props: Props) {
  return (
    createPortal(
      <div id="merit-dialog">
        <FullscreenDialog
          title="Settings"
          titleStyle={titleStyle}
          style={{ backgroundColor: 'var(--background-color)' }}
          appBarStyle={{ backgroundColor: 'var(--background-color)' }}
          appBarZDepth={0}
          open={props.open}
          onRequestClose={props.handleSettingsClose}
        >
          <Settings
            history={props.history}
            state={props.state}
            logOut={props.logOut}
          />
        </FullscreenDialog>
      </div>,
      document.body
    )
  );
};
