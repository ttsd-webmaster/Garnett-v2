import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

export default class AllChalkboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'date',
      filterName: 'Date',
      reverse: false,
      open: false
    };
  }

  openPopover = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  closePopover = () => {
    this.setState({
      open: false,
    });
  };

  setFilter = (filterName) => {
    let filter = filterName.replace(/ /g,'');
    filter = filter[0].toLowerCase() + filter.substr(1);

    this.setState({
      filter: filter,
      filterName: filterName,
      reverse: false,
      open: false
    });
  }

  filterCount(chalkboard, filter) {
    if (filter === 'timeCommitment') {
      return chalkboard[filter].value;
    }
    else if (filter === 'attendees') {
      if (chalkboard[filter] === undefined) {
        return 0;
      }
      else {
        return Object.keys(chalkboard[filter]).length;
      }
    }
    else {
      return chalkboard[filter];
    }
  }

  reverse = () => {
    let reverse = true;

    if (this.state.reverse) {
      reverse = false;
    }

    this.setState({
      reverse: reverse
    });
  }

  render() {
    let toggleIcon = "icon-down-open-mini";
    let filter = this.state.filter;
    let label;

    let upcomingChalkboards = this.props.upcomingChalkboards.sort(function(a, b) {
      let chalkboard1 = [];
      let chalkboard2 = [];
      
      if (filter === 'attendees') {
        if (a[filter] !== undefined) {
          chalkboard1 = a[filter];
        }
        if (b[filter] !== undefined) {
          chalkboard2 = b[filter];
        }
        return Object.keys(chalkboard1).length > Object.keys(chalkboard2).length;
      }
      return chalkboard1[filter] > chalkboard2[filter];
    });
    let completedChalkboards = this.props.completedChalkboards.sort(function(a, b) {
      let chalkboard1 = [];
      let chalkboard2 = [];
      
      if (filter === 'attendees') {
        if (a[filter] !== undefined) {
          chalkboard1 = a[filter];
        }
        if (b[filter] !== undefined) {
          chalkboard2 = b[filter];
        }
        return Object.keys(chalkboard1).length > Object.keys(chalkboard2).length;
      }
      return chalkboard1[filter] > chalkboard2[filter];
    });

    if (this.state.reverse) {
      upcomingChalkboards = this.state.upcomingChalkboards.slice().reverse();
      completedChalkboards = this.state.completedChalkboards.slice().reverse();
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
          <span style={{float:'right'}}>
            <span style={{cursor:'pointer'}} onClick={this.openPopover}> 
              {this.state.filterName}
            </span>
            <IconButton
              iconClassName={toggleIcon}
              className="reverse-toggle"
              onClick={this.reverse}
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
                    {this.filterCount(chalkboard, filter)} {label}
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
                    {this.filterCount(chalkboard, filter)} {label}
                  </p>
                </ListItem>
                <Divider className="garnett-divider large" inset={true} />
              </div>
            </LazyLoad>
          ))}
        </List>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closePopover}
        >
          <Menu>
            <MenuItem
              primaryText="Date"
              insetChildren
              checked={this.state.filterName === 'Date'}
              onClick={() => this.setFilter('Date')}
            />
            <MenuItem
              primaryText="Amount"
              insetChildren
              checked={this.state.filterName === 'Amount'}
              onClick={() => this.setFilter('Amount')}
            />
            <MenuItem
              primaryText="Time Commitment"
              insetChildren
              checked={this.state.filterName === 'Time Commitment'}
              onClick={() => this.setFilter('Time Commitment')}
            />
            <MenuItem
              primaryText="Attendees"
              insetChildren
              checked={this.state.filterName === 'Attendees'}
              onClick={() => this.setFilter('Attendees')}
            />
          </Menu>
        </Popover>
      </div>
    )
  }
}
