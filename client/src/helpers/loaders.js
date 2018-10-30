import 'containers/PledgeApp/MobilePledgeApp.css';
import { isMobileDevice } from './functions.js';

import React, { Fragment } from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

const completingTaskDialogMobile = {
  display: 'flex',
  alignItems: 'center'
};

const completingTaskDialog = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

function LoadingPage(props) {
  return (
    <div className="loading-container">
      <div className="app-header no-tabs">
        <span> {props.name} </span>
        <LoadingComponent />
      </div>
    </div>
  )
}

export function LoadingLogin() {
  if (isMobileDevice()) {
    return (
      <div className="loading">
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
  } else {
    return (
      <div className="loading">
        <div className="loading-image"></div>
      </div>
    )
  }
}

export const LoadingMobilePledgeApp = (props) => (
  <div className="loading-container">
    <BottomNavigation className="bottom-tabs" />
  </div>
)

export const LoadingDataApp =  () => (
  <Fragment>
    <LoadingPage name="Data App" />
    <BottomNavigation
      className="bottom-tabs"
      selectedIndex={0}
    >
      <BottomNavigationItem
        label="Pledge Data"
        icon={<div></div>}
      />
      <BottomNavigationItem
        label="Rush Data"
        icon={<div></div>}
      />
      <BottomNavigationItem
        label="My Data"
        icon={<div></div>}
      />
    </BottomNavigation>
  </Fragment>
)

export const LoadingComponent =  () => (
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

export const CompletingTaskDialog = (props) => (
  <Dialog
    contentStyle={isMobileDevice() ? null : {maxWidth: '500px'}}
    bodyStyle={
      isMobileDevice()
        ? completingTaskDialogMobile 
        : completingTaskDialog
    }
    modal={true}
    open={props.open}
  >
    <CircularProgress
      size={isMobileDevice() ? 25 : 90}
      thickness={isMobileDevice() ? 3.5 : 5}
    />
    <span
      style={
        isMobileDevice() 
          ? { margin: 'auto' }
          : { marginTop: '50px' }
      }
    > 
      {props.message}
    </span>
  </Dialog>
)

export const LoadingHome =  () => <LoadingPage name="Home" />;
export const LoadingDelibsApp =  () => <LoadingPage name="Delibs App" />;
export const LoadingRusheeProfile =  () => <LoadingPage name="Rushee Profile" />;
