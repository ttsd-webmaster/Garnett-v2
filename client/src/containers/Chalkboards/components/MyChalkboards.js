import sortChalkboards from './helpers/sortChalkboards.js';

import React from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export default function MyChalkboards({
  myHostingChalkboards,
  myAttendingChalkboards,
  myCompletedChalkboards,
  state,
  reverse,
  filter,
  filterName,
  openPopover,
  reverseChalkboards,
  handleOpen,
  filterCount
}) {
  let myHostingChalkboards = sortChalkboards(myHostingChalkboards, filter);
  let myAttendingChalkboards = sortChalkboards(myAttendingChalkboards, filter);
  let myCompletedChalkboards = sortChalkboards(myCompletedChalkboards, filter);
  let toggleIcon = "icon-down-open-mini";
  let label;

  if (reverse) {
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
      {state.status !== 'pledge' && (
        <div>
          <Subheader className="garnett-subheader">
            Hosting
            <span style={{float:'right', height:'48px'}}>
              <span className="garnett-filter" onClick={openPopover}> 
                {filterName}
              </span>
              <IconButton
                iconClassName={toggleIcon}
                className="reverse-toggle"
                onClick={reverseChalkboards}
              />
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
                  onClick={() => handleOpen(chalkboard, 'hosting')}
                >
                  <p className="garnett-date">
                    {filterCount(chalkboard, filter)} {label}
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
        {state.status === 'pledge' && (
          <span style={{float:'right'}}>
            <span className="garnett-filter" onClick={openPopover}> 
              {filterName}
            </span>
            <IconButton
              iconClassName={toggleIcon}
              className="reverse-toggle"
              onClick={reverseChalkboards}
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
              onClick={() => handleOpen(chalkboard, 'attending')}
            >
              <p className="garnett-date">
                {filterCount(chalkboard, filter)} {label}
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
              onClick={() => handleOpen(chalkboard, 'attending')}
            >
              <p className="garnett-date">
                {filterCount(chalkboard, filter)} {label}
              </p>
            </ListItem>
            <Divider className="garnett-divider large" inset={true} />
          </div>
        ))}
      </List>
    </div>
  )
}
