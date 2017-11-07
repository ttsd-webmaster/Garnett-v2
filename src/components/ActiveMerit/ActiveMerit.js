import './ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

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
          leftAvatar={<Avatar src={require('./images/angie_joung.jpg')} />}
        >
          <p className="pledge-name"> Angie Joung </p>
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/dat_nguyen.jpg')} />}
        >
          <p className="pledge-name"> Dat Nguyen </p>
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/erick_wilson.jpg')} />}
        >
          <p className="pledge-name"> Erick Wilson </p>
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/huy_tran.jpg')} />}
        >
          <p className="pledge-name"> Huy Tran </p>
          <p className="active-merits"> 0/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/jerry_qing.jpg')} />}
        >
          <p className="pledge-name"> Jerry Qing </p>
          <p className="active-merits"> 50/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/justin_lee.jpg')} />}
        >
          <p className="pledge-name"> Justin Lee </p>
          <p className="active-merits"> 20/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/kakeru_imanaka.jpg')} />}
        >
          <p className="pledge-name"> Kakeru Imanaka </p>
          <p className="active-merits"> 100/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/soyoun_park.jpg')} />}
        >
          <p className="pledge-name"> Soyoun Park </p>
          <p className="active-merits"> 0/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/stacy_kim.jpg')} />}
        >
          <p className="pledge-name"> Stacy Kim </p>
          <p className="active-merits"> 5/100 </p>
        </ListItem>
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src={require('./images/sydney_huynh.jpg')} />}
        >
          <p className="pledge-name"> Sydney Huynh </p>
          <p className="active-merits"> 90/100 </p>
        </ListItem>
      </List>
    )
  }
}
