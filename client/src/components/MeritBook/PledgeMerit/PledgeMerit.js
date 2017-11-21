import './PledgeMerit.css';

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

export default class PledgeMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    let height = document.getElementById('pledge-merit').clientHeight;
    let screenHeight = document.body.clientHeight - 150;

    if (height < screenHeight) {
      document.getElementById('pledge-merit').style.height = 'calc(100vh - 150px)';
    }
  }

  render() {
    return (
      <div id="pledge-merit">
        <List style={listStyle}>
          {this.props.meritArray.reverse().map((merit, i) => (
            <div key={i}>
              <ListItem
                innerDivStyle={listItemStyle}
                leftAvatar={<Avatar size={70} src={merit.photoURL} style={avatarStyle} />}
                primaryText={
                  <p className="merit-name"> {merit.name} </p>
                }
                secondaryText={
                  <p>
                    {merit.description}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="merit-amount"> {merit.amount} </p>
              </ListItem>
              <Divider style={dividerStyle} inset={true} />
            </div>
          ))}
        </List>
      </div>
    )
  }
}
