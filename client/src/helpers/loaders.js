import React from 'react';

function LoadingLogin() {
  return (
    <div className="loading">
      <div className="loading-image"></div>
    </div>
  )
}

function LoadingPledgeApp() {
  return (
    <div className="loading-container">
      <div className="app-header loading">
        Merit Book
      </div>
    </div>
  )
}

function LoadingMeritBook() {
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

export {LoadingLogin, LoadingPledgeApp, LoadingMeritBook};