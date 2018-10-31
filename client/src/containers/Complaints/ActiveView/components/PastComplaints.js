import { PlaceholderMerit } from 'components/Placeholders.js';

import React from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export default function PastComplaints({
  complaints,
  reverse,
  reverseComplaints
}) {
  let toggleIcon = "icon-down-open-mini";
  if (reverse) {
    complaints = complaints.slice().reverse();
    toggleIcon = "icon-up-open-mini";
  }

  return (
    <div id="past-complaints">
      <Subheader className="garnett-subheader">
        Recent
        <IconButton
          style={{float:'right',cursor:'pointer'}}
          iconClassName={toggleIcon}
          className="reverse-toggle"
          onClick={reverseComplaints}
        />
      </Subheader>
      
      <List className="garnett-list">
        {complaints.map((complaint, i) => (
          <LazyLoad
            height={88}
            offset={window.innerHeight}
            once
            overflow
            key={i}
            placeholder={PlaceholderMerit()}
          >
            <div>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="garnett-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          </LazyLoad>
        ))}
      </List>
    </div>
  )
}