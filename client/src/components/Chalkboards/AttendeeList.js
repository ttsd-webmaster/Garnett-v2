import './Chalkboards.css';
import API from "../../api/API.js";

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

  componentDidMount() {
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
      <List>
        {this.state.attendees.map((attendee, i) => (
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
