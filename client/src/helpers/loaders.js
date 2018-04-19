import {isMobileDevice} from './functions.js';

import React from 'react';
import {Tabs} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

const tabContainerStyle = {
  position: 'fixed',
  top: 52,
  backgroundColor: '#fff',
  borderBottom: '1px solid #e0e0e0',
  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
  zIndex: 1
};

const completingTaskDialogMobile = {
  display: 'flex',
  alignItems: 'center'
};

const completingTaskDialog = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

function LoadingLogin() {
  return (
    isMobileDevice() ? (
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
    ) : (
      <div className="loading">
        <div className="loading-image"></div>
      </div>
    )
  )
}

function LoadingPledgeApp() {
  return (
    <div className="loading-container">
      <div className="app-header">
        <span> Merit Book </span>
      </div>
      <Tabs tabItemContainerStyle={tabContainerStyle}></Tabs>
    </div>
  )
}

function LoadingComponent() {
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
}

const loaderWrapper = (name) => (props) => {
  return (
    <div className="loading-container">
      <div className="app-header no-tabs">
        <span> {name} </span>
        <LoadingComponent />
      </div>
    </div>
  )
}

function CompletingTaskDialog(props) {
  return (
    isMobileDevice() ? (
      <Dialog
        bodyStyle={completingTaskDialogMobile}
        modal={true}
        open={props.open}
      >
        <CircularProgress size={25} />
        <span style={{margin:'auto'}}> {props.message} </span>
      </Dialog>
    ) : (
      <Dialog
        contentStyle={{maxWidth:'500px'}}
        bodyStyle={completingTaskDialog}
        modal={true}
        open={props.open}
      >
        <CircularProgress size={90} thickness={5} />
        <span style={{marginTop:'50px'}}> {props.message} </span>
      </Dialog>
    )
  )
}

const LoadingHome = loaderWrapper('Home');
const LoadingDelibsApp = loaderWrapper('Delibs App');
const LoadingRusheeProfile = loaderWrapper('Rushee Profile');

export {
  LoadingLogin,
  LoadingPledgeApp,
  LoadingComponent,
  CompletingTaskDialog,
  LoadingHome,
  LoadingDelibsApp,
  LoadingRusheeProfile
};
