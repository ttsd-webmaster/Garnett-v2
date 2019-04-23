// @flow

import 'containers/PledgeApp/PledgeApp.css';
import { isMobile } from './functions.js';

import React, { type Node } from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

const spinnerDialogMobile = {
  display: 'flex',
  alignItems: 'center'
};

const spinnerDialog = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

function LoadingPage(props: { name: string }): Node {
  return (
    <div className="loading-container">
      <div className="app-header no-tabs">
        <span>{ props.name }</span>
        <LoadingComponent />
      </div>
    </div>
  )
};

export function LoadingComponent(): Node {
  return (
    <div className="loader-container">
      <div className="line-scale-container">
        <div className="line-scale">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
};

export function SpinnerDialog(props: { open: boolean, message: string }): Node {
  const contentStyle = isMobile() ? null : {maxWidth: '500px'};
  const bodyStyle = isMobile() ? spinnerDialogMobile : spinnerDialog;
  const size = isMobile() ? 25 : 90;
  const thickness = isMobile() ? 2.5 : 5;
  const messageStyle = isMobile() ? { margin: 'auto' } : { marginTop: '50px' };
  return (
    <Dialog
      contentStyle={contentStyle}
      bodyStyle={bodyStyle}
      modal={true}
      open={props.open}
    >
      <CircularProgress size={size} thickness={thickness} />
      <span style={messageStyle}>{ props.message }</span>
    </Dialog>
  )
};

export const FetchingListSpinner = (
  <div className="fetching-users" key={0}>
    <CircularProgress
      color="var(--accent-color)"
      size={30}
      style={{ margin: '0 auto' }}
    />
  </div>
);

export const LoadingHome =  () => <LoadingPage name="Home" />;
export const LoadingDelibsApp =  () => <LoadingPage name="Delibs App" />;
export const LoadingRusheeProfile =  () => <LoadingPage name="Rushee Profile" />;
