import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class PastComplaints extends Component {
  render() {
    return (
      <div id="past-complaints">
        <Subheader className="garnett-subheader"> General </Subheader>
        <List className="garnett-list">
          {this.props.complaints.map((complaint, i) => (
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
                leftAvatar={<Avatar className="garnett-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="garnett-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </LazyLoad>
          ))}
        </List>
      </div>
    )
  }
}
