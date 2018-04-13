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
      open: false,
      filter: 'date',
      filterName: 'Date',
      reverse: false
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
      open: false,
      filter: filter,
      filterName: filterName,
      reverse: false
    });
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

    let upcomingChalkboards = this.props.upcomingChalkboards.sort(function(a, b) {
      return a[filter] > b[filter];
    });
    let completedChalkboards = this.props.completedChalkboards.sort(function(a, b) {
      return a[filter] > b[filter];
    });

    if (this.state.reverse) {
      upcomingChalkboards = upcomingChalkboards.slice().reverse();
      completedChalkboards = completedChalkboards.slice().reverse();
      toggleIcon = "icon-up-open-mini";
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
                    {filter === 'timeCommitment' ? (
                      chalkboard[filter].value
                    ) : (
                      chalkboard[filter]
                    )}
                    {filter === 'amount' && (
                      ' merits'
                    )}
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
                    {filter === 'timeCommitment' ? (
                      chalkboard[filter].value
                    ) : (
                      chalkboard[filter]
                    )}
                    {filter === 'amount' && (
                      ' merits'
                    )}
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
            <MenuItem primaryText="Date" onClick={() => this.setFilter('Date')} />
            <MenuItem primaryText="Amount" onClick={() => this.setFilter('Amount')} />
            <MenuItem primaryText="Time Commitment" onClick={() => this.setFilter('Time Commitment')} />
          </Menu>
        </Popover>
      </div>
    )
  }
}
