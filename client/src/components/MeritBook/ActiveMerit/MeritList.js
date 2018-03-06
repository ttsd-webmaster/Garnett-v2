import '../MeritBook.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class ActiveMerit extends Component {
  render() {
    return (
      <List id="merit-dialog-list">
        {this.props.merits.map((merit, i) => (
          <div key={i}>
            <div>
              <Divider className="pledge-divider" inset={true} />
              <ListItem
                className="pledge-list-item"
                leftAvatar={<Avatar className="pledge-image" src={merit.photoURL} />}
                primaryText={
                  <p className="merit-name"> {merit.name} </p>
                }
                secondaryText={
                  <p> {merit.description} </p>
                }
              >
                <div className="merit-amount-container small">
                  <p className="merit-date small"> {merit.date} </p>
                  <p className="merit-amount small"> {merit.amount} </p>
                </div>
              </ListItem>
              <Divider className="pledge-divider" inset={true} />
            </div>
          </div>
        ))}
      </List>
    )
  }
}
