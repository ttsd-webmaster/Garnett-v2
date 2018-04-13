import '../Chalkboards.css';
import API from '../../../api/API.js';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

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
            <Divider className="garnett-divider large" inset={true} />
            <ListItem
              className="garnett-list-item large"
              leftAvatar={<Avatar className="garnett-image large" size={70} src={attendee.photoURL} />}
              primaryText={
                <p className="attendee-name"> {attendee.name} </p>
              }
            />
            <Divider className="garnett-divider large" inset={true} />
          </div>
        ))}
      </List>
    )
  }
}
