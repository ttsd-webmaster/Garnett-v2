import { PlaceholderContacts } from 'components/Placeholders';

import React from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export function UserRow({
  user,
  handleOpen
}) {
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
          onClick={() => handleOpen(user)}
        >
          {user.status === 'pledge' && <p className="pledge-merits"> {user.totalMerits} </p>}
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    </LazyLoad>
  )  
}
