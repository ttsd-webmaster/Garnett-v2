import {isMobileDevice} from './functions.js';

import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

const inkBarStyle = {
  position: 'fixed',
  top: 100,
  backgroundColor: 'var(--primary-color)',
  zIndex: 1
};

const tabContainerStyle = {
  position: 'fixed',
  top: 52,
  backgroundColor: 'white',
  borderBottom: '1px solid #e0e0e0',
  boxShadow: 'rgba(12, 42, 51, 0.3) 0px 1px 8px',
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

function LoadingHome() {
  return (
    <div className="loading-container">
      <div className="app-header"></div>
    </div>
  )
}

function LoadingPledgeApp() {
  return (
    <div className="loading-container">
      <div className="app-header">
        <span> Merit Book </span>
      </div>
      <Tabs
        inkBarStyle={inkBarStyle}
        tabItemContainerStyle={tabContainerStyle}
      >
        <Tab 
          icon={<i style={{color: 'var(--primary-color)'}} className="icon-star"></i>}
        >
        </Tab>
        <Tab
          icon={<i style={{color: 'var(--secondary-light)'}} className="icon-address-book"></i>}
        >
        </Tab>
        <Tab
          icon={<i style={{color: 'var(--secondary-light)'}} className="icon-calendar-empty"></i>}
        >
        </Tab>
        <Tab
          icon={<i style={{color: 'var(--secondary-light)'}} className="icon-thumbs-down-alt"></i>}
        >
        </Tab>
        <Tab
          icon={<i style={{color: 'var(--secondary-light)'}} className="icon-cog"></i>}
        >
        </Tab>
      </Tabs>
    </div>
  )
}

const wrapDelibsApp = (Slot) => (props) => {
  return (
    <div className="loading-container">
      <div className="app-header">
        <Slot {...props} />
      </div>
    </div>
  )
}

function LoadingRusheeProfile() {
  return (
    <div className="loading-container">
      <div className="app-header"></div>
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

export {
  LoadingLogin,
  LoadingHome,
  LoadingPledgeApp,
  wrapDelibsApp,
  LoadingRusheeProfile,
  LoadingComponent,
  CompletingTaskDialog
};
