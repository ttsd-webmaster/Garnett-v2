import { PlaceholderContacts } from 'components/Placeholders';

import React from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export function MeritUserRow({
  user,
  selectUser
}) {
  const isIPhone = navigator.userAgent.match(/iPhone/i);
  // Lazyload doesn't work on iPhone for some reason
  if (isIPhone) {
    return (
      <div>
        <Divider className="garnett-divider large" inset={true} />
        <ListItem
          className="garnett-list-item large"
          leftAvatar={<Avatar className="garnett-image large" size={70} src={user.photoURL} />}
          primaryText={
            <p className="garnett-name"> {user.firstName} {user.lastName}</p>
          }
          secondaryText={
            <p className="garnett-description">
              {user.year}
              <br />
              {user.major}
            </p>
          }
          secondaryTextLines={2}
          onClick={selectUser}
        >
          <p className="pledge-merits"> {user.remainingMerits} </p>
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    )
  }
  return (
    <LazyLoad
      height={88}
      offset={window.innerHeight}
      once
      overflow
      placeholder={PlaceholderContacts()}
    >
      <div>
        <Divider className="garnett-divider large" inset={true} />
        <ListItem
          className="garnett-list-item large"
          leftAvatar={<Avatar className="garnett-image large" size={70} src={user.photoURL} />}
          primaryText={
            <p className="garnett-name"> {user.firstName} {user.lastName}</p>
          }
          secondaryText={
            <p className="garnett-description">
              {user.year}
              <br />
              {user.major}
            </p>
          }
          secondaryTextLines={2}
          onClick={selectUser}
        >
          <p className="pledge-merits"> {user.remainingMerits} </p>
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    </LazyLoad>
  )  
}
