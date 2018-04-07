import '../../MeritBook.css';
import API from '../../../../api/API.js';
import {isMobileDevice} from '../../../../helpers/functions.js';

import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

let listItem = 'garnett-list-item';

if (!isMobileDevice()) {
  listItem += ' small';
}

export default class ComplaintsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complaints: []
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      API.getPledgeComplaints(this.props.pledgeName)
      .then(res => {
        this.setState({
          complaints: res.data
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
        {this.state.complaints.map((complaint, i) => (
          <div key={i}>
            <Divider className="garnett-divider" />
            <ListItem
              className={listItem}
              primaryText={
                <p className="garnett-description"> {complaint.description} </p>
              }
            >
              <p className="garnett-date"> {complaint.date} </p>
            </ListItem>
            <Divider className="garnett-divider" />
          </div>
        ))}
      </List>
    )
  }
}
