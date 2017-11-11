import './ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listStyle = {
  textAlign: 'left'
};

const listItemStyle = {
  backgroundColor: '#fff',
  paddingLeft: '102px',
  zIndex: -1
};

const avatarStyle = {
  top: 8,
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px'
};

const dividerStyle = {
  marginLeft: '102px'
};

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <List style={listStyle}>
        {this.props.userArray.map((pledge, i) => (
          <div>
            <ListItem
              innerDivStyle={listItemStyle}
              leftAvatar={<Avatar size={70} src={pledge.photoURL} style={avatarStyle} />}
              primaryText={
                <p className="pledge-name"> {pledge.firstName + ' ' + pledge.lastName} </p>
              }
              secondaryText={
                <p>
                  {pledge.year}
                  <br />
                  {pledge.major}
                </p>
              }
              secondaryTextLines={2}
            >
              <p className="active-merits"> 100/100 </p>
            </ListItem>
            <Divider style={dividerStyle} inset={true} />
          </div>
        ))}
      </List>
    )
  }
}
