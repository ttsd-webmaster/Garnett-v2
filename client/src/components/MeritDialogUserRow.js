// @flow

import { PlaceholderContacts } from 'components/Placeholders';

import React, { PureComponent, type Node } from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

type Props = {
  user: User,
  selectUser: () => void
};

export class MeritDialogUserRow extends PureComponent<Props> {
  get userInfo(): Node {
    const { user, selectUser } = this.props;
    const {
      firstName,
      lastName,
      year,
      major,
      remainingMerits
    } = user;
    return (
      <div>
        <Divider className="garnett-divider large" inset={true} />
        <ListItem
          className="garnett-list-item large"
          leftAvatar={<Avatar className="garnett-image large" size={70} src={user.photoURL} />}
          primaryText={
            <p className="garnett-name">{ firstName } { lastName }</p>
          }
          secondaryText={
            <p className="garnett-description">
              { year }
              <br />
              { major }
            </p>
          }
          secondaryTextLines={2}
          onClick={selectUser}
        >
          <p className="pledge-merits">{ remainingMerits }</p>
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    )
  }

  render() {
    const isIPhone = navigator.userAgent.match(/iPhone/i);
    // Lazyload doesn't work on iPhone for some reason
    if (isIPhone) {
      return this.userInfo
    }
    return (
      <LazyLoad
        height={88}
        offset={window.innerHeight}
        once
        overflow
        placeholder={PlaceholderContacts()}
      >
        { this.userInfo }
      </LazyLoad>
    )
  }
}
