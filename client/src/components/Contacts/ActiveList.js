import './Contacts.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listItemStyle = {
  backgroundColor: '#fff',
  paddingLeft: '102px',
  zIndex: -1
};

const avatarStyle = {
  top: 8,
  objectFit: 'cover'
};

const dividerStyle = {
  position: 'relative',
  marginLeft: '102px'
};

export default class ActiveList extends Component {
  render() {
    return (
      this.props.activeArray.map((active, i) => (
        this.props.classLabel === active.class &&
          <div key={i}>
            <Divider style={dividerStyle} inset={true} />
            <ListItem
              innerDivStyle={listItemStyle}
              leftAvatar={<Avatar size={70} src={active.photoURL} style={avatarStyle} />}
              primaryText={
                <p className="active-name"> {active.firstName} {active.lastName}</p>
              }
              secondaryText={
                <p>
                  {active.year}
                  <br />
                  {active.major}
                </p>
              }
              secondaryTextLines={2}
              onClick={() => this.props.handleOpen(active)}
            >
            </ListItem>
            <Divider style={dividerStyle} inset={true} />
          </div>
      ))
    )
  }
}
