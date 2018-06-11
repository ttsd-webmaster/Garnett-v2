import sortChalkboards from './sortChalkboards.js';

import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export default class AllChalkboards extends Component {
  render() {
    let toggleIcon = "icon-down-open-mini";
    let filter = this.props.filter;
    let label;

    let upcomingChalkboards = sortChalkboards(this.props.upcomingChalkboards, filter);
    let completedChalkboards = sortChalkboards(this.props.completedChalkboards, filter);

    if (this.props.reverse) {
      upcomingChalkboards = upcomingChalkboards.slice().reverse();
      completedChalkboards = completedChalkboards.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    if (filter === 'amount') {
      label = 'merits';
    }
    else if (filter === 'attendees') {
      label = 'attendees';
    }

    return (
      <div id="all-chalkboards">
        <Subheader className="garnett-subheader">
          Upcoming
          <span style={{float:'right', height:'48px'}}>
            <span style={{cursor:'pointer'}} onClick={this.props.openPopover}> 
              {this.props.filterName}
            </span>
            <IconButton
              iconClassName={toggleIcon}
              className="reverse-toggle"
              onClick={this.props.reverseChalkboards}
            >
            </IconButton>
          </span>
        </Subheader>

        <List className="garnett-list">
          {upcomingChalkboards.map((chalkboard, i) => (
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
              <div>
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
                  <p className="garnett-date"> 
                    {this.props.filterCount(chalkboard, filter)} {label}
                  </p>
                </ListItem>
                <Divider className="garnett-divider large" inset={true} />
              </div>
            </LazyLoad>
          ))}
        </List>

        <Divider className="garnett-subheader" />

        <Subheader className="garnett-subheader"> Completed </Subheader>
        <List className="garnett-list">
          {completedChalkboards.map((chalkboard, i) => (
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
              <div>
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
                  <p className="garnett-date">
                    {this.props.filterCount(chalkboard, filter)} {label}
                  </p>
                </ListItem>
                <Divider className="garnett-divider large" inset={true} />
              </div>
            </LazyLoad>
          ))}
        </List>
      </div>
    )
  }
}
