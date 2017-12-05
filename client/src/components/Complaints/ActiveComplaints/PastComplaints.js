import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const dividerStyle = {
  marginLeft: '102px'
};

export default class ActiveList extends Component {
  componentDidUpdate() {
    let contentContainer = document.querySelector('.content-container');
    let view = document.getElementById('past-complaints');
    let index = 3;

    if (view.classList.contains('active')) {
      let height = view.clientHeight;
      
      contentContainer.childNodes[index].style.marginBottom = '57px';
      contentContainer.childNodes[index].scrollTop = height;
    }
  }

  render() {
    return (
      <div id="past-complaints">
        <List className="pledge-list">
          {this.props.complaintsArray.map((complaint, i) => (
            <LazyLoad
              height={88}
              offset={500}
              once
              unmountIfInvisible
              overflow
              key={i}
              placeholder={
                <div className="placeholder-skeleton">
                  <Divider style={dividerStyle} inset={true} />
                  <div className="placeholder-avatar"></div>
                  <div className="placeholder-name"></div>
                  <div className="placeholder-year"></div>
                  <div className="placeholder-merits"></div>
                  <Divider style={dividerStyle} inset={true} />
                </div>
              }
            >
              <div>
                <Divider className="pledge-divider large" inset={true} />
                <ListItem
                  className="pledge-list-item large"
                  leftAvatar={<Avatar className="pledge-image large" size={70} src={complaint.photoURL} />}
                  primaryText={
                    <p className="pledge-name"> {complaint.pledgeName} </p>
                  }
                  secondaryText={
                    <p className="complaints-description">
                      {complaint.description}
                    </p>
                  }
                  secondaryTextLines={2}
                >
                  <p className="complaints-date"> {complaint.date} </p>
                </ListItem>
                <Divider className="pledge-divider large" inset={true} />
              </div>
            </LazyLoad>
          ))}
        </List>
      </div>
    )
  }
}