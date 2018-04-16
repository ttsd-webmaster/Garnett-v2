import '../Complaints.css';
import {loadFirebase} from '../../../helpers/functions.js';
import {LoadingComponent} from '../../../helpers/loaders.js';

import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

const listItemStyle = {
  backgroundColor: '#fff',
  zIndex: -1
};

export default class PledgeComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      complaints: this.props.complaints,
      reverse: false
    }
  }

  componentWillMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let fullName = this.props.state.displayName;
        let firebase = window.firebase;
        let complaintsRef = firebase.database().ref('/users/' + fullName + '/Complaints/');

        complaintsRef.on('value', (snapshot) => {
          let complaints = this.state.complaints;

          if (snapshot.val()) {
            complaints = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            }).sort((a, b) => {
              return a.date < b.date ? 1 : -1;
            });
          }

          console.log('Complaints Array: ', complaints);
          localStorage.setItem('pledgeComplaints', JSON.stringify(complaints));

          this.setState({
            loaded: true,
            complaints: complaints
          });
        });
      });
    }
    else {
      this.setState({
        loaded: true
      });
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
      this.state.loaded ? (
        <div id="pledge-complaints">
          <Subheader className="garnett-subheader">
            Recent
            <IconButton
              style={{float:'right',cursor:'pointer'}}
              iconClassName={toggleIcon}
              className="reverse-toggle"
              onClick={this.reverse}
            >
            </IconButton>
          </Subheader>

          <List className="garnett-list">
            {complaints.map((complaint, i) => (
              <LazyLoad
                height={88}
                offset={window.innerHeight}
                once
                overflow
                key={i}
                placeholder={
                  <div className="placeholder-skeleton">
                    <Divider />
                    <div className="placeholder-description"></div>
                    <Divider />
                  </div>
                }
              >
                <div>
                  <Divider />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText={
                      <p className="garnett-description">
                        {complaint.description}
                      </p>
                    }
                  >
                    <p className="garnett-date"> {complaint.date} </p>
                  </ListItem>
                  <Divider />
                </div>
              </LazyLoad>
            ))}
          </List>
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}