import { PlaceholderMerit } from 'components/Placeholders';

import React from 'react'
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export function MeritRow({
  merit,
  photo,
  name,
  primaryText,
  handleDeleteOpen
}) {
  const isIPhone = navigator.userAgent.match(/iPhone/i);
  // Lazyload doesn't work on iPhone for some reason
  if (isIPhone) {
    return (
      <div>
        <Divider className="garnett-divider large" inset={true} />
        <ListItem
          className="garnett-list-item large"
          leftAvatar={
            <Avatar
              size={70}
              src={photo}
              className="garnett-image large"
            />
          }
          primaryText={
            primaryText ? primaryText : <p className="garnett-name">{name}</p>
          }
          secondaryText={
            <p className="garnett-description">{merit.description}</p>
          }
          secondaryTextLines={2}
          onClick={() => handleDeleteOpen && handleDeleteOpen(merit)}
        >
          <div className="merit-amount-container">
            <p className="merit-date">{merit.date}</p>
            {merit.amount > 0 ? (
              <p className="merit-amount green">+{merit.amount}</p>
            ) : (
              <p className="merit-amount red">{merit.amount}</p>
            )}
          </div>
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    )
  }
  return (
    <LazyLoad
      height={88}
      offset={window.screen.height}
      once
      overflow
      placeholder={PlaceholderMerit()}
    >
      <div>
        <Divider className="garnett-divider large" inset={true} />
        <ListItem
          className="garnett-list-item large"
          leftAvatar={
            <Avatar
              size={70}
              src={photo}
              className="garnett-image large"
            />
          }
          primaryText={
            primaryText ? primaryText : <p className="garnett-name">{name}</p>
          }
          secondaryText={
            <p className="garnett-description">{merit.description}</p>
          }
          secondaryTextLines={2}
          onClick={() => handleDeleteOpen && handleDeleteOpen(merit)}
        >
          <div className="merit-amount-container">
            <p className="merit-date">{merit.date}</p>
            {merit.amount > 0 ? (
              <p className="merit-amount green">+{merit.amount}</p>
            ) : (
              <p className="merit-amount red">{merit.amount}</p>
            )}
          </div>
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    </LazyLoad>
  )
}
