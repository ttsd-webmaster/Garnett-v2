import '../Chalkboards.css';
import API from '../../../api/API.js';
import {isMobileDevice} from '../../../helpers/functions.js';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

let image = 'garnett-image';
let imageSize = 40;
let listItem = 'garnett-list-item';
let divider = 'garnett-divider';
let attendeeName = 'attendee-name';

if (isMobileDevice()) {
  image += ' large';
  imageSize = 70;
  listItem += ' large';
  divider += ' large';
  attendeeName += ' large';
}

export default class AttendeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendees: []
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      API.getAttendees(this.props.chalkboard)
      .then((res) => {
        this.setState({
          attendees: res.data
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.props.handleRequestOpen('There was an error retrieving the attendees');
      });
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }
  }

  render() {
    return (
      <List className="garnett-list dialog">
        {this.state.attendees.map((attendee, i) => (
          <div key={i}>
            <Divider className={divider} inset={true} />
            <ListItem
              className={listItem}
              leftAvatar={<Avatar className={image} size={imageSize} src={attendee.photoURL} />}
              primaryText={
                <p className={attendeeName}> {attendee.name} </p>
              }
            />
            <Divider className={image} inset={true} />
          </div>
        ))}
      </List>
    )
  }
}
