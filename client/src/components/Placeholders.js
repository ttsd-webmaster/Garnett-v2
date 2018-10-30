import React from 'react';
import Divider from 'material-ui/Divider';

export function PlaceholderMerit() {
  return (
    <div className="placeholder-skeleton">
      <Divider className="garnett-divider large" inset={true} />
      <div className="placeholder-avatar"></div>
      <div className="placeholder-name"></div>
      <div className="placeholder-year"></div>
      <div className="placeholder-date"></div>
      <div className="placeholder-merits"></div>
      <Divider className="garnett-divider large" inset={true} />
    </div>
  )
}

export function PlaceholderContacts() {
  return (
    <div className="placeholder-skeleton">
      <Divider className="garnett-divider large" inset={true} />
      <div className="placeholder-avatar"></div>
      <div className="placeholder-name"></div>
      <div className="placeholder-year"></div>
      <div className="placeholder-major"></div>
      <Divider className="garnett-divider large" inset={true} />
    </div>
  )
}

export function PlaceholderPledgeComplaint() {
  return (
    <div className="placeholder-skeleton">
      <Divider />
      <div className="placeholder-description"></div>
      <Divider />
    </div>
  )
}

export function PlaceholderRusheeList() {
  return (
    <div className="placeholder-skeleton">
      <Divider className="garnett-divider large" inset={true} />
      <div className="placeholder-avatar"></div>
      <div className="placeholder-name"></div>
      <div className="placeholder-year"></div>
      <Divider className="garnett-divider large" inset={true} />
    </div>
  )
}
