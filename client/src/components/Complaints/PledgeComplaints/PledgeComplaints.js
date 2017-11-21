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

  componentDidMount() {
    let height = document.getElementById('pledge-complaints').clientHeight;
    let screenHeight = document.body.clientHeight - 100;

    if (height < screenHeight) {
      document.getElementById('pledge-complaints').style.height = 'calc(100vh - 100px)';
    }
  }

  render() {
    return (
      <div id="pledge-complaints">
        <List style={listStyle}>
          {this.props.complaintsArray.map((complaint, i) => (
            <div key={i}>
              <Divider />
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