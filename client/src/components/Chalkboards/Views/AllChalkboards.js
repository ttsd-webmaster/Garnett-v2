import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class AllChalkboards extends Component {
  render() {
    return (
      <div id="all-chalkboards">
        <Subheader className="garnett-subheader"> Upcoming </Subheader>
        <List className="garnett-list">
          {this.props.upcomingChalkboards.map((chalkboard, i) => (
            <LazyLoad
              height={88}
              offset={window.innerHeight}
              once
              overflow
              key={i}
              placeholder={
                <div className="placeholder-skeleton">
                  <Divider className="garnett-divider large" inset={true} />
                  <div className="placeholder-avatar"></div>
                  <div className="placeholder-name"></div>
                  <div className="placeholder-year"></div>
                  <div className="placeholder-merits"></div>
                  <Divider className="garnett-divider large" inset={true} />
                </div>
              }
            >
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={chalkboard.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {chalkboard.title} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {chalkboard.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.props.handleOpen(chalkboard, 'upcoming')}
              >
                <p className="garnett-date"> {chalkboard.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </LazyLoad>
          ))}
        </List>

        <Divider className="garnett-subheader" />

        <Subheader className="garnett-subheader"> Completed </Subheader>
        <List className="garnett-list">
          {this.props.completedChalkboards.map((chalkboard, i) => (
            <LazyLoad
              height={88}
              offset={window.innerHeight}
              once
              overflow
              key={i}
              placeholder={
                <div className="placeholder-skeleton">
                  <Divider className="garnett-divider large" inset={true} />
                  <div className="placeholder-avatar"></div>
                  <div className="placeholder-name"></div>
                  <div className="placeholder-year"></div>
                  <div className="placeholder-merits"></div>
                  <Divider className="garnett-divider large" inset={true} />
                </div>
              }
            >
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={chalkboard.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {chalkboard.title} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {chalkboard.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.props.handleOpen(chalkboard, 'completed')}
              >
                <p className="garnett-date"> {chalkboard.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </LazyLoad>
          ))}
        </List>
      </div>
    )
  }
}
