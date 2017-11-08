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
          primaryText="Angie Joung"
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
          primaryText="Dat Nguyen"
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
          primaryText="Eric Wilson"
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
          primaryText="Huy Tran"
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
          primaryText="Jerry Qing"
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
          primaryText="Justin Lee"
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
          primaryText="Kakeru Imanaka"
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
          primaryText="Soyoun Park"
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
          primaryText="Stacy Kim"
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
          primaryText="Sydney Huynh"
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
