// @flow

import type { User } from 'api/models';

import React, { Fragment } from 'react';
import { List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const phoneStyle = {
  display: 'block',
  textDecoration: 'none'
};

type Props = {
  user: User,
  name: string,
  remainingMerits?: number
};

export function UserInfo(props: Props) {
  const {
    photoURL,
    class: className,
    phone,
    email,
    major
  } = props.user;

  return (
    <Fragment>
      <div className="user-photo-container">
        <img className="user-photo" src={photoURL} alt="User" />
      </div>
      <h1 className="user-name">{ props.name }</h1>
      <List className="garnett-list">
        <Divider className="garnett-divider" />
        {props.remainingMerits && (
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Merits Remaining</p>}
            secondaryText={
              <p className="garnett-description">{ props.remainingMerits }</p>
            }
            leftIcon={<i className="icon-star garnett-icon"></i>}
          />
        )}
        <Divider className="garnett-divider" inset={true} />
        <ListItem
          className="garnett-list-item"
          primaryText={<p className="garnett-name">Class</p>}
          secondaryText={<p className="garnett-description">{ className }</p>}
          leftIcon={<i className="icon-users garnett-icon"></i>}
        />
        <Divider className="garnett-divider" inset={true} />
        <ListItem
          className="garnett-list-item"
          primaryText={<p className="garnett-name">Major</p>}
          secondaryText={<p className="garnett-description">{ major }</p>}
          leftIcon={<i className="icon-graduation-cap garnett-icon"></i>}
        />
        <Divider className="garnett-divider" inset={true} />
        <a style={phoneStyle} href={`tel:${phone}`}>
          <ListItem
            className="garnett-list-item"
            primaryText={<p className="garnett-name">Phone Number</p>}
            secondaryText={<p className="garnett-description">{ phone }</p>}
            leftIcon={<i className="icon-phone garnett-icon"></i>}
          />
        </a>
        <Divider className="garnett-divider" inset={true} />
        <ListItem
          className="garnett-list-item"
          primaryText={<p className="garnett-name">Email Address</p>}
          secondaryText={<p className="garnett-description">{ email }</p>}
          leftIcon={<i className="icon-mail-alt garnett-icon"></i>}
        />
        <Divider className="garnett-divider" />
      </List>
    </Fragment>
  )
}
