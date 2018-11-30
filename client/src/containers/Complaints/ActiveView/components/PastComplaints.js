import { FilterHeader } from 'components';
import { PlaceholderMerit } from 'components/Placeholders';

import React from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export default function PastComplaints({
  complaints,
  reverse,
  reverseComplaints
}) {
  if (reverse) {
    complaints = complaints.slice().reverse();
  }

  return (
    <div id="past-complaints">
      <FilterHeader
        title="Recent"
        isReversed={reverse}
        reverse={reverseComplaints}
      />
      
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
