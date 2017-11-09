import './ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listItemStyle = {
  textAlign: 'left'
};

const listInnerStyle = {
  paddingLeft: '102px'
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
      <List>
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/angie_joung.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Angie Joung </p>
          }
          secondaryText={
            <p> 
              2nd Year 
              <br />
              Bioengineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/dat_nguyen.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Dat Nguyen </p>
          }
          secondaryText={
            <p> 
              4th Year 
              <br />
              Structural Engineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/erick_wilson.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Erick Wilson </p>
          }
          secondaryText={
            <p> 
              2nd Year 
              <br />
              Computer Science
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/huy_tran.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Huy Tran </p>
          }
          secondaryText={
            <p> 
              1st Year 
              <br />
              Mechanical Engineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 0/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/jerry_qing.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Jerry Qing </p>
          }
          secondaryText={
            <p> 
              1st Year 
              <br />
              Electrical Engineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 50/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/justin_lee.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Justin Lee </p>
          }
          secondaryText={
            <p> 
              3rd Year 
              <br />
              Environmental Engineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 20/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/kakeru_imanaka.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Kakeru Imanaka </p>
          }
          secondaryText={
            <p> 
              5th Year 
              <br />
              Mechanical Engineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/soyoun_park.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Soyoun Park </p>
          }
          secondaryText={
            <p> 
              1st Year 
              <br />
              Nanoengineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 0/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/stacy_kim.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Stacy Kim </p>
          }
          secondaryText={
            <p> 
              1st Year 
              <br />
              Structural Engineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 5/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          style={listItemStyle}
          innerDivStyle={listInnerStyle}
          leftAvatar={<Avatar size={70} src={require('./images/sydney_huynh.jpg')} style={avatarStyle} />}
          primaryText={
            <p className="pledge-name"> Sydney Huynh </p>
          }
          secondaryText={
            <p> 
              2nd Year 
              <br />
              Structural Engineering
            </p>
          }
          secondaryTextLines={2}
        >
          <p className="active-merits"> 90/100 </p>
        </ListItem>
      </List>
    )
  }
}
