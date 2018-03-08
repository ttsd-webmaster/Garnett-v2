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
              <Divider className="garnett-divider" inset={true} />
              <ListItem
                className="garnett-list-item"
                leftAvatar={<Avatar className="garnett-image" src={attendee.photoURL} />}
                primaryText={
                  <p className="attendee-name"> {attendee.name} </p>
                }
              />
              <Divider className="garnett-divider" inset={true} />
            </div>
          </div>
        ))}
      </List>
    )
  }
}
