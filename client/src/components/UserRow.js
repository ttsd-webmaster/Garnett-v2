// @flow

import { PlaceholderContacts } from 'components/Placeholders';
import type { User } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

type Props = {
  user: User,
  handleOpen: () => void
};

export class UserRow extends PureComponent<Props> {
  get body(): Node {
    const { user, handleOpen } = this.props;
    return (
      <div>
        <Divider className="garnett-divider large" inset={true} />
        <ListItem
          className="garnett-list-item large"
          leftAvatar={
            <Avatar className="garnett-image large" size={70} src={user.photoURL} />
          }
          primaryText={
            <p className="garnett-name">{user.firstName} {user.lastName}</p>
          }
          secondaryText={
            <p className="garnett-description">
              {user.year}
              <br />
              {user.major}
            </p>
          }
          secondaryTextLines={2}
          onClick={handleOpen}
        >
          {user.status === 'pledge' && (
            <p className="pledge-merits">{user.totalMerits}</p>
          )}
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    )
  }

  render() {
    const isIPhone = navigator.userAgent.match(/iPhone/i);
    // Lazyload doesn't work on iPhone for some reason
    if (isIPhone) {
      return this.body;
    }
    return (
      <LazyLoad
        height={88}
        offset={window.innerHeight}
        once
        overflow
        placeholder={PlaceholderContacts()}
      >
        { this.body }
      </LazyLoad>
    )
  }
}
