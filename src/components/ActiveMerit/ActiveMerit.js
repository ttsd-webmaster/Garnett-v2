import './ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import API from "../../api/API.js";

const listStyle = {
  textAlign: 'left'
};

const listItemStyle = {
  backgroundColor: '#fff',
  paddingLeft: '102px',
  zIndex: -1
};

const avatarStyle = {
  top: 8
};

const dividerStyle = {
  marginLeft: '102px'
};

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.merit = this.merit.bind(this);
  }

  merit(pledge) {
    let token = this.props.state.token;
    let pledgeName = pledge.firstName + pledge.lastName;
    let activeName = this.props.state.name;
    let description = 'Good Greet';
    let amount = 10;
    let photoURL = this.props.state.photoURL;

    API.merit(token, pledgeName, activeName, description, amount, photoURL)
    .then(res => {
      console.log(res);
    })
    .catch(err => console.log('err', err));
  }

  render() {
    return (
      <List style={listStyle}>
        {this.props.userArray.map((pledge, i) => (
          <div key={i}>
            <ListItem
              innerDivStyle={listItemStyle}
              leftAvatar={<Avatar size={70} src={pledge.photoURL} style={avatarStyle} />}
              primaryText={
                <p className="pledge-name"> {pledge.firstName} {pledge.lastName} </p>
              }
              secondaryText={
                <p>
                  {pledge.year}
                  <br />
                  {pledge.major}
                </p>
              }
              secondaryTextLines={2}
              onClick={() => this.merit(pledge)}
            >
              <p className="active-merits"> {pledge.totalMerits} </p>
            </ListItem>
            <Divider style={dividerStyle} inset={true} />
          </div>
        ))}
      </List>
    )
  }
}
