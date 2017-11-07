import './ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const avatarStyle = {
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
          leftAvatar={<Avatar size={70} src={require('./images/angie_joung.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Angie Joung </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/dat_nguyen.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Dat Nguyen </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/erick_wilson.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Erick Wilson </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/huy_tran.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Huy Tran </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 0/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/jerry_qing.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Jerry Qing </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 50/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/justin_lee.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Justin Lee </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 20/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/kakeru_imanaka.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Kakeru Imanaka </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/soyoun_park.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Soyoun Park </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 0/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/stacy_kim.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Stacy Kim </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 5/100 </p>
        </ListItem>
        <Divider style={dividerStyle} inset={true} />
        <ListItem
          leftAvatar={<Avatar size={70} src={require('./images/sydney_huynh.jpg')} style={avatarStyle} />}
        >
          <div className="pledge-info-container">
            <p className="pledge-name"> Sydney Huynh </p>
            <p className="pledge-info"> 3rd Year </p>
            <p className="pledge-info"> Computer Science </p>
          </div>
          <p className="active-merits"> 90/100 </p>
        </ListItem>
      </List>
    )
  }
}
