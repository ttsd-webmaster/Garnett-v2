import '../MeritBook.css';
import API from '../../../api/API.js';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      merits: []
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      API.getPledgeMerits(this.props.pledge)
      .then(res => {
        this.setState({
          merits: res.data.merits
        });
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }
  }

  render() {
    return (
      <List id="merit-dialog-list">
        {this.state.merits.map((merit, i) => (
          <div key={i}>
            <div>
              <Divider className="garnett-divider" inset={true} />
              <ListItem
                className="garnett-list-item"
                leftAvatar={<Avatar className="garnett-image" src={merit.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {merit.name} </p>
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
              <Divider className="garnett-divider" inset={true} />
            </div>
          </div>
        ))}
      </List>
    )
  }
}
