import './Settings.css';

import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
const firebase = window.firebase;

const listItemStyle = {
  textAlign: 'left'
};

const dividerStyle = {
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px'
};

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      email: '',
      class: '',
      major: '',
      photoURL: '',
    }
  }

  componentWillMount() {
    let user = firebase.auth().currentUser;
    let userRef = firebase.database().ref('/users/' + user.displayName);
    userRef.on('value', (snapshot) => {
      this.setState({
        name: snapshot.val().firstName + ' ' + snapshot.val().lastName,
        phone: snapshot.val().phone,
        email: snapshot.val().email,
        class: snapshot.val().class,
        major: snapshot.val().major,
        photoURL: snapshot.val().photoURL,
      });
    })
  }

  render() {
    return (
      <div>
        <img className="user-photo" src={require(`${this.state.photoURL}`)} />
        <List style={listItemStyle}>
          <Divider />
          <ListItem
            primaryText="Name"
            secondaryText={this.state.name}
            leftIcon={
              <i className="icon-user settings-icon"></i>
            }
          />
          <Divider inset={true} />
          <ListItem
            primaryText="Phone Number"
            secondaryText={this.state.phone}
            leftIcon={
              <i className="icon-phone settings-icon"></i>
            }
          />
          <Divider inset={true} />
          <ListItem
            primaryText="Email Address"
            secondaryText={this.state.email}
            leftIcon={
              <i className="icon-mail-alt settings-icon"></i>
            }
          />
          <Divider inset={true} />
          <ListItem
            primaryText="Class"
            secondaryText={this.state.class}
            leftIcon={
              <i className="icon-users settings-icon"></i>
            }
          />
          <Divider inset={true} />
          <ListItem
            primaryText="Major"
            secondaryText={this.state.major}
            leftIcon={
              <i className="icon-briefcase settings-icon"></i>
            }
          />
          <Divider style={dividerStyle} />
        </List>
      </div>
    )
  }
}