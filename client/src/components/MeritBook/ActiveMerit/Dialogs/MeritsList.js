import '../../MeritBook.css';
import API from '../../../../api/API.js';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class MeritsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      merits: []
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      API.getPledgeMerits(this.props.pledgeName)
      .then(res => {
        this.setState({
          merits: res.data
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
      <List className="garnett-list dialog">
        {this.state.merits.map((merit, i) => (
          <div key={i}>
            <Divider className="garnett-divider large" inset={true} />
            <ListItem
              className="garnett-list-item large"
              leftAvatar={<Avatar className="garnett-image large" size={70} src={merit.photoURL} />}
              primaryText={
                <p className="garnett-name"> {merit.name} </p>
              }
              secondaryText={
                <p> {merit.description} </p>
              }
              secondaryTextLines={2}
            >
              <div className="merit-amount-container">
                <p className="merit-date"> {merit.date} </p>
                <p className="merit-amount"> {merit.amount} </p>
              </div>
            </ListItem>
            <Divider className="garnett-divider large" inset={true} />
          </div>
        ))}
      </List>
    )
  }
}
