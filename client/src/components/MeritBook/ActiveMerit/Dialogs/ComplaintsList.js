import '../../MeritBook.css';
import API from 'api/API.js';

import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export default class ComplaintsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complaints: [],
      reverse: false
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
      this.props.handleRequestOpen('You are offline');
    }
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

    let complaints = this.state.complaints;

    if (this.state.reverse) {
      complaints = complaints.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    return (
      <div>
        <Subheader className="garnett-subheader dialog">
          Recent
          <IconButton
            style={{float:'right',cursor:'pointer'}}
            iconClassName={toggleIcon}
            className="reverse-toggle"
            onClick={this.reverse}
          />
        </Subheader>

        <List className="garnett-list dialog pledge">
          {complaints.map((complaint, i) => (
            <div key={i}>
              <Divider className="garnett-divider" />
              <ListItem
                className="garnett-list-item"
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
      </div>
    )
  }
}
