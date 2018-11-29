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
        <Divider className="garnett-divider" inset={true} />
        <ListItem
          className="garnett-list-item"
          leftAvatar={<Avatar className="garnett-image" src={user.photoURL} />}
          primaryText={
            <p className="garnett-name"> {user.firstName} {user.lastName}</p>
          }
          onClick={selectUser}
        >
          <p className="pledge-merits"> {user.remainingMerits} </p>
        </ListItem>
        <Divider className="garnett-divider" inset={true} />
      </div>
    )
  }
  return (
    <LazyLoad
      height={88}
      offset={window.innerHeight}
      once
      overflow
    >
      <div>
        <Divider className="garnett-divider" inset={true} />
        <ListItem
          className="garnett-list-item"
          leftAvatar={<Avatar className="garnett-image" src={user.photoURL} />}
          primaryText={
            <p className="garnett-name"> {user.firstName} {user.lastName}</p>
          }
          onClick={selectUser}
        >
          <p className="pledge-merits"> {user.remainingMerits} </p>
        </ListItem>
        <Divider className="garnett-divider" inset={true} />
      </div>
    </LazyLoad>
  )  
}
