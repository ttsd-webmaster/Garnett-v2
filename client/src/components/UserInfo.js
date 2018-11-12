import React, { Fragment } from 'react';
import { List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const activePhoneNumber = {
  display: 'block',
  textDecoration: 'none'
}

export function UserInfo({
  photoURL,
  name,
  className,
  totalMerits,
  meritsRemaining,
  phone,
  email,
  major
}) {
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
  else if (meritsRemaining) {
    firstRowName = 'Merits Remaining';
    firstRowDescription = meritsRemaining;
    firstRowIcon = 'star';
  }
  else {
    return null;
  }

  return (
    <Fragment>
      <img className="dialog-photo" src={photoURL} alt="User" />
      <List>
        <Divider className="garnett-divider" />
        <ListItem
          className="garnett-list-item"
          primaryText={<p className="garnett-name">{firstRowName}</p>}
          secondaryText={<p className="garnett-description">{firstRowDescription}</p>}
          leftIcon={<i className={`icon-${firstRowIcon} garnett-icon`}></i>}
        />
        <Divider className="garnett-divider" inset={true} />
        <a style={activePhoneNumber} href={`tel:${phone}`}>
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
