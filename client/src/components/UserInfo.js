// @flow

import React, { Fragment } from 'react';
import { List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const phoneStyle = {
  display: 'block',
  textDecoration: 'none'
};

type Props = {
  photoURL: string,
  name: string,
  className: string,
  totalMerits: number,
  remainingMerits: number,
  phone: string,
  email: string,
  major: string
};

export function UserInfo(props: Props) {
  const {
    photoURL,
    name,
    className,
    totalMerits,
    remainingMerits,
    phone,
    email,
    major
  } = props;
  let firstRowName, firstRowDescription, firstRowIcon;
  // Settings
  if (name && className) {
    firstRowName = 'Name';
    firstRowDescription = name;
    firstRowIcon = 'user';
  } 
  // Contacts
  else if (className) {
    firstRowName = 'Class';
    firstRowDescription = className;
    firstRowIcon = 'users';
  }
  // Pledge Info Dialog (Pledge)
  else if (totalMerits) {
    firstRowName = 'Total Merits';
    firstRowDescription = totalMerits;
    firstRowIcon = 'star';
  }
  // Pledge Info Dialog (Active)
  else if (remainingMerits) {
    firstRowName = 'Merits Remaining';
    firstRowDescription = remainingMerits;
    firstRowIcon = 'star';
  }
  else {
    return null;
  }

  return (
    <Fragment>
      <div className="user-photo-container">
        <img className="user-photo" src={photoURL} alt="User" />
      </div>
      <List>
        <Divider className="garnett-divider" />
        <ListItem
          className="garnett-list-item"
          primaryText={<p className="garnett-name">{firstRowName}</p>}
          secondaryText={<p className="garnett-description">{firstRowDescription}</p>}
          leftIcon={<i className={`icon-${firstRowIcon} garnett-icon`}></i>}
        />
        <Divider className="garnett-divider" inset={true} />
        <a style={phoneStyle} href={`tel:${phone}`}>
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Phone Number</p>}
            secondaryText={<p className="garnett-description">{phone}</p>}
            leftIcon={<i className="icon-phone garnett-icon"></i>}
          />
        </a>
        <Divider className="garnett-divider" inset={true} />
        <ListItem
          className="garnett-list-item"
          primaryText={<p className="garnett-name">Email Address</p>}
          secondaryText={<p className="garnett-description">{email}</p>}
          leftIcon={<i className="icon-mail-alt garnett-icon"></i>}
        />
        {name && className && (
          <Fragment>
            <Divider className="garnett-divider" inset={true} />
            <ListItem
              className="garnett-list-item"
              primaryText={<p className="garnett-name">Class</p>}
              secondaryText={<p className="garnett-description">{className}</p>}
              leftIcon={<i className="icon-users garnett-icon"></i>}
            />
          </Fragment>
        )}
        <Divider className="garnett-divider" inset={true} />
        <ListItem
          className="garnett-list-item"
          primaryText={<p className="garnett-name">Major</p>}
          secondaryText={<p className="garnett-description">{major}</p>}
          leftIcon={<i className="icon-graduation-cap garnett-icon"></i>}
        />
        <Divider className="garnett-divider" />
      </List>
    </Fragment>
  )
}
