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

const backHomeStyle = {
  float: 'right',
  marginRight: '15px'
};

const completingTaskDialogStyle = {
  display: 'flex',
  alignItems: 'center'
};

function LoadingLogin() {
  return (
    <div className="loading">
      <div className="loading-image"></div>
    </div>
  )
}

function LoadingHome() {
  return (
    <div className="loading-container">
      <div className="app-header">
        <span> Home </span>
        <span style={backHomeStyle}> Log Out </span>
      </div>
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
        <span> Delibs App </span>
        <span style={backHomeStyle}> Home </span>
        <Slot {...props} />
      </div>
    </div>
  )
}

function LoadingRusheeProfile() {
  return (
    <div className="loading-container">
      <div className="app-header">
        <span> Rushee Profile </span>
        <span style={backHomeStyle}> Back </span>
      </div>
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
    <Dialog
      bodyStyle={completingTaskDialogStyle}
      modal={true}
      open={props.open}
    >
      <CircularProgress size={25} />
      <span style={{margin:'auto'}}> {props.message} </span>
    </Dialog>
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
