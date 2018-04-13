import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

export default class MyChalkboards extends Component {
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

    let myHostingChalkboards = this.props.myHostingChalkboards.sort(function(a, b) {
      return a[filter] > b[filter];
    });
    let myAttendingChalkboards = this.props.myAttendingChalkboards.sort(function(a, b) {
      return a[filter] > b[filter];
    });
    let myCompletedChalkboards = this.props.myCompletedChalkboards.sort(function(a, b) {
      return a[filter] > b[filter];
    });

    if (this.state.reverse) {
      myHostingChalkboards = myHostingChalkboards.slice().reverse();
      myAttendingChalkboards = myAttendingChalkboards.slice().reverse();
      myCompletedChalkboards = myCompletedChalkboards.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    return (
      <div id="my-chalkboards" className="active">
        {this.props.state.status !== 'pledge' && (
          <div>
            <Subheader className="garnett-subheader">
              Hosting
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
              {myHostingChalkboards.map((chalkboard, i) => (
                <div key={i}>
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
                    onClick={() => this.props.handleOpen(chalkboard, 'hosting')}
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
              ))}
            </List>

            <Divider className="garnett-subheader" />
          </div>
        )}

        <Subheader className="garnett-subheader">
          Attending
          {this.props.state.status === 'pledge' && (
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
          )}
        </Subheader>
        <List className="garnett-list">
          {myAttendingChalkboards.map((chalkboard, i) => (
            <div key={i}>
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
                onClick={() => this.props.handleOpen(chalkboard, 'attending')}
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
          ))}
        </List>

        <Divider className="garnett-subheader" />

        <Subheader className="garnett-subheader"> Completed </Subheader>
        <List className="garnett-list">
          {myCompletedChalkboards.map((chalkboard, i) => (
            <div key={i}>
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
