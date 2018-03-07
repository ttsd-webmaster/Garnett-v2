import './Chalkboards.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class AttendeeList extends Component {
  render() {
    return (
      <List>
        {this.props.attendees.map((attendee, i) => (
          <div key={i}>
            <div>
              <Divider className="pledge-divider" inset={true} />
              <ListItem
                className="pledge-list-item"
                leftAvatar={<Avatar className="pledge-image" src={attendee.photoURL} />}
                primaryText={
                  <p className="attendee-name"> {attendee.name} </p>
                }
              />
              <Divider className="pledge-divider" inset={true} />
            </div>
          </div>
        ))}
      </List>
    )
  }
}
