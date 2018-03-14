import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

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

export {LoadingLogin, LoadingHome, LoadingPledgeApp, LoadingComponent};
