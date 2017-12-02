import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class ActiveList extends Component {
  componentDidUpdate() {
    let view = document.getElementById('past-complaints');

    if (view) {
      let height = view.clientHeight;
      let screenHeight = window.innerHeight - 157;

      if (height <= screenHeight) {
        view.style.height = 'calc(100vh - 157px)';
      }
      else {
        view.style.height = '';
        view.style.marginBottom = '57px';
      }
    }
  }

  render() {
    return (
      <div id="past-complaints">
        <List className="pledge-list">
          {this.props.complaintsArray.map((complaint, i) => (
            <div key={i}>
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
          ))}
        </List>
      </div>
    )
  }
}