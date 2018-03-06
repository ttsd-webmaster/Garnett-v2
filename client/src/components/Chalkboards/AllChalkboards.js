import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class AllChalkboards extends Component {
  componentDidUpdate() {
    let contentContainer = document.querySelector('.content-container');
    let view = document.getElementById('all-chalkboards');
    let index = 2;

    if (view.classList.contains('active')) {
      let height = view.clientHeight;
      
      if (this.props.scrollPosition) {
        contentContainer.childNodes[index].scrollTop = this.props.scrollPosition;
      }
      else {
        contentContainer.childNodes[index].scrollTop = height;
      }
    }
  }

  render() {
    return (
      <div id="all-chalkboards">
        <List className="pledge-list">
          <Subheader> Upcoming </Subheader>
          {this.props.upcomingChalkboards.map((chalkboard, i) => (
            <LazyLoad
              height={88}
              offset={500}
              once
              unmountIfInvisible
              overflow
              key={i}
              placeholder={
                <div className="placeholder-skeleton">
                  <Divider className="pledge-divider large" inset={true} />
                  <div className="placeholder-avatar"></div>
                  <div className="placeholder-name"></div>
                  <div className="placeholder-year"></div>
                  <div className="placeholder-merits"></div>
                  <Divider className="pledge-divider large" inset={true} />
                </div>
              }
            >
              <div>
                <Divider className="pledge-divider large" inset={true} />
                <ListItem
                  className="pledge-list-item large"
                  leftAvatar={<Avatar className="pledge-image large" size={70} src={chalkboard.photoURL} />}
                  primaryText={
                    <p className="pledge-name"> {chalkboard.title} </p>
                  }
                  secondaryText={
                    <p className="chalkboards-description">
                      {chalkboard.description}
                    </p>
                  }
                  secondaryTextLines={2}
                >
                  <p className="chalkboards-date"> {chalkboard.date} </p>
                </ListItem>
                <Divider className="pledge-divider large" inset={true} />
              </div>
            </LazyLoad>
          ))}

          <Divider />

          <Subheader> Completed </Subheader>
          {this.props.completedChalkboards.map((chalkboard, i) => (
            <LazyLoad
              height={88}
              offset={500}
              once
              unmountIfInvisible
              overflow
              key={i}
              placeholder={
                <div className="placeholder-skeleton">
                  <Divider className="pledge-divider large" inset={true} />
                  <div className="placeholder-avatar"></div>
                  <div className="placeholder-name"></div>
                  <div className="placeholder-year"></div>
                  <div className="placeholder-merits"></div>
                  <Divider className="pledge-divider large" inset={true} />
                </div>
              }
            >
              <div>
                <Divider className="pledge-divider large" inset={true} />
                <ListItem
                  className="pledge-list-item large"
                  leftAvatar={<Avatar className="pledge-image large" size={70} src={chalkboard.photoURL} />}
                  primaryText={
                    <p className="pledge-name"> {chalkboard.title} </p>
                  }
                  secondaryText={
                    <p className="chalkboards-description">
                      {chalkboard.description}
                    </p>
                  }
                  secondaryTextLines={2}
                >
                  <p className="chalkboards-date"> {chalkboard.date} </p>
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
