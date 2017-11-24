import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
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
    let height = document.getElementById('pledge-complaints').offsetHeight;
    let screenHeight = window.innerHeight - 100;

    if (height < screenHeight) {
      document.getElementById('pledge-complaints').style.height = 'calc(100vh - 100px)';
    }
  }

  render() {
    return (
      <div id="pledge-complaints">
        <List style={listStyle}>
          {this.props.complaintsArray.map((complaint, i) => (
            <LazyLoad height={88} offset={100} unmountIfInvisible key={i}>
              <div>
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
            </LazyLoad>
          ))}
        </List>
      </div>
    )
  }
}