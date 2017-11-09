import './Settings.css';

import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
const firebase = window.firebase;

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
        <List>
          <Divider />
          <ListItem
            primaryText={this.state.name}
          />
          <Divider />
          <ListItem
            primaryText={this.state.phone}
          />
          <Divider />
          <ListItem
            primaryText={this.state.email}
          />
          <Divider />
          <ListItem
            primaryText={this.state.class}
          />
          <Divider />
          <ListItem
            primaryText={this.state.major}
          />
        </List>
      </div>
    )
  }
}