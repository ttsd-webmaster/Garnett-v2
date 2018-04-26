import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export default class MyChalkboards extends Component {
  render() {
    let toggleIcon = "icon-down-open-mini";
    let filter = this.props.filter;
    let label;

    let myHostingChalkboards = this.props.myHostingChalkboards.sort(function(a, b) {
      if (filter === 'attendees') {
        let chalkboard1 = [];
        let chalkboard2 = [];
        
        if (a[filter] !== undefined) {
          chalkboard1 = a[filter];
        }
        if (b[filter] !== undefined) {
          chalkboard2 = b[filter];
        }
        return Object.keys(chalkboard1).length > Object.keys(chalkboard2).length ? 1 : -1;
      }
      else if (filter === 'timeCommitment') {
        return a[filter].value < b[filter].value ? 1 : -1;
      }
      else {
        return a[filter] > b[filter] ? 1 : -1;
      }
    });
    let myAttendingChalkboards = this.props.myAttendingChalkboards.sort(function(a, b) {
      if (filter === 'attendees') {
        let chalkboard1 = [];
        let chalkboard2 = [];
        
        if (a[filter] !== undefined) {
          chalkboard1 = a[filter];
        }
        if (b[filter] !== undefined) {
          chalkboard2 = b[filter];
        }
        return Object.keys(chalkboard1).length > Object.keys(chalkboard2).length ? 1 : -1;
      }
      else if (filter === 'timeCommitment') {
        return a[filter].value < b[filter].value ? 1 : -1;
      }
      else {
        return a[filter] > b[filter] ? 1 : -1;
      }
    });
    let myCompletedChalkboards = this.props.myCompletedChalkboards.sort(function(a, b) {
      if (filter === 'attendees') {
        let chalkboard1 = [];
        let chalkboard2 = [];

        if (a[filter] !== undefined) {
          chalkboard1 = a[filter];
        }
        if (b[filter] !== undefined) {
          chalkboard2 = b[filter];
        }
        return Object.keys(chalkboard1).length > Object.keys(chalkboard2).length ? 1 : -1;
      }
      else if (filter === 'timeCommitment') {
        return a[filter].value < b[filter].value ? 1 : -1;
      }
      else {
        return a[filter] > b[filter] ? 1 : -1;
      }
    });

    if (this.props.reverse) {
      myHostingChalkboards = myHostingChalkboards.slice().reverse();
      myAttendingChalkboards = myAttendingChalkboards.slice().reverse();
      myCompletedChalkboards = myCompletedChalkboards.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    if (filter === 'amount') {
      label = 'merits';
    }
    else if (filter === 'attendees') {
      label = 'attendees';
    }

    return (
      <div id="my-chalkboards" className="active">
        {this.props.state.status !== 'pledge' && (
          <div>
            <Subheader className="garnett-subheader">
              Hosting
              <span style={{float:'right'}}>
                <span className="garnett-filter" onClick={this.props.openPopover}> 
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
                      {this.props.filterCount(chalkboard, filter)} {label}
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
              <span className="garnett-filter" onClick={this.props.openPopover}> 
                {this.props.filterName}
              </span>
              <IconButton
                iconClassName={toggleIcon}
                className="reverse-toggle"
                onClick={this.props.reverseChalkboards}
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
                  {this.props.filterCount(chalkboard, filter)} {label}
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
                  {this.props.filterCount(chalkboard, filter)} {label}
                </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))}
        </List>
      </div>
    )
  }
}
