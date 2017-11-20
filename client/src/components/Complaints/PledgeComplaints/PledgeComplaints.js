import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listStyle = {
  textAlign: 'left'
};

const listItemStyle = {
  backgroundColor: '#fff',
  zIndex: -1
};

export default class PledgeComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <List style={listStyle}>
          {this.props.complaintsArray.map((complaint, i) => (
            <div key={i}>
              <ListItem
                innerDivStyle={listItemStyle}
                primaryText={
                  <p> {complaint.description} </p>
                }
              >
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </div>
    )
  }
}