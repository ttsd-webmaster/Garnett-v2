// @flow

import 'containers/PledgeApp/PledgeApp.css';
import { isMobile } from './functions.js';

import React, { type Node } from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import 'mobile-pull-to-refresh/dist/styles/material/style.css';

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

export function PullToRefreshSpinner(): Node {
  return (
    <div className="pull-to-refresh-material__control">
      <svg className="pull-to-refresh-material__icon" fill="#4285f4" width="24" height="24" viewBox="0 0 24 24">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>

      <svg className="pull-to-refresh-material__spinner" width="24" height="24" viewBox="25 25 50 50">
        <circle className="pull-to-refresh-material__path" cx="50" cy="50" r="20" fill="none" stroke="#4285f4" strokeWidth="4" strokeMiterlimit="10" />
      </svg>
    </div>
  )
};

export const LoadingHome =  () => <LoadingPage name="Home" />;
export const LoadingDelibsApp =  () => <LoadingPage name="Delibs App" />;
export const LoadingRusheeProfile =  () => <LoadingPage name="Rushee Profile" />;
