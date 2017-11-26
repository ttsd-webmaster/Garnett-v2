import '../MeritBook.css';

import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listItemStyle = {
  backgroundColor: '#fff',
  paddingLeft: '102px',
  zIndex: -1
};

const avatarStyle = {
  top: 9,
  objectFit: 'cover'
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
    let screenHeight = window.innerHeight - 166;

    if (height < screenHeight) {
      document.getElementById('pledge-merit').style.height = 'calc(100vh - 166px)';
    }
  }

  render() {
    return (
      <List id="pledge-merit">
        {this.props.meritArray.map((merit, i) => (
          <LazyLoad
            height={88}
            offset={300}
            unmountIfInvisible
            key={i}
            placeholder={
              <div className="placeholder-skeleton">
                <Divider style={dividerStyle} inset={true} />
                <div className="placeholder-avatar"></div>
                <div className="placeholder-name"></div>
                <div className="placeholder-year"></div>
                <div className="placeholder-date"></div>
                <div className="placeholder-merits"></div>
                <Divider style={dividerStyle} inset={true} />
              </div>
            }
          >
            <div>
              <Divider style={dividerStyle} inset={true} />
              <ListItem
                innerDivStyle={listItemStyle}
                leftAvatar={<Avatar size={70} src={merit.photoURL} style={avatarStyle} />}
                primaryText={
                  <p className="merit-name"> {merit.name} </p>
                }
                secondaryText={
                  <p> {merit.description} </p>
                }
                secondaryTextLines={2}
              >
                <div className="merit-amount-container">
                  <p className="merit-date"> {merit.date} </p>
                  <p className="merit-amount"> {merit.amount} </p>
                </div>
              </ListItem>
              <Divider style={dividerStyle} inset={true} />
            </div>
          </LazyLoad>
        ))}
      </List>
    )
  }
}
