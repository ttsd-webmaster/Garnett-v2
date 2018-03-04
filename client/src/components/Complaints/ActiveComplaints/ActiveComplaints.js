import '../Complaints.css';
import {loadFirebase} from '../../../helpers/functions.js';
import MyComplaints from './MyComplaints';
import PastComplaints from './PastComplaints';

import React, {Component} from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

export default class ActiveComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      pledge: null,
      description: '',
      pledgeArray: this.props.pledgeArray,
      complaintsArray: this.props.complaintsArray,
      approvedComplaintsArray: [],
      pendingComplaintsArray: []
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let complaintsRef = firebase.database().ref('/approvedComplaints/');

        complaintsRef.on('value', (snapshot) => {
          let complaintsArray = [];
          if (snapshot.val()) {
            complaintsArray = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          console.log('Complaints Array: ', complaintsArray);

          localStorage.setItem('activeComplaintsArray', JSON.stringify(complaintsArray));

          if (this.props.state.status === 'active') {
            let fullName = this.props.state.displayName;
            let userRef = firebase.database().ref('/users/' + fullName);

            userRef.on('value', (snapshot) => {
              let approvedComplaintsArray = [];
              let pendingComplaintsArray = [];

              if (snapshot.val().pendingComplaints) {
                pendingComplaintsArray = Object.keys(snapshot.val().pendingComplaints).map(function(key) {
                  return snapshot.val().pendingComplaints[key];
                });
              }
              if (snapshot.val().approvedComplaints) {
                approvedComplaintsArray = Object.keys(snapshot.val().approvedComplaints).map(function(key) {
                  return snapshot.val().approvedComplaints[key];
                });
              }

              this.setState({
                complaintsArray: complaintsArray,
                pendingComplaintsArray: pendingComplaintsArray,
                approvedComplaintsArray: approvedComplaintsArray
              });
            });
          }
          else {
            let pendingComplaintsRef = firebase.database().ref('/pendingComplaints/');

            pendingComplaintsRef.on('value', (snapshot) => {
              let pendingComplaintsArray = [];

              if (snapshot.val()) {
                pendingComplaintsArray = Object.keys(snapshot.val()).map(function(key) {
                  return snapshot.val()[key];
                });
              }

              this.setState({
                complaintsArray: complaintsArray,
                pendingComplaintsArray: pendingComplaintsArray,
                approvedComplaintsArray: complaintsArray
              });
            });
          }
        });
      })
      .catch(err => console.log(err));
    }
  }

  select = (index) => {
    let previousIndex = this.state.selectedIndex;
    let myComplaints = document.getElementById('my-complaints');
    let pastComplaints = document.getElementById('past-complaints');

    if (previousIndex !== index) {
      myComplaints.classList.toggle('active');
      pastComplaints.classList.toggle('active');
    }

    this.setState({selectedIndex: index});
  }

  render() {
    return (
      <div>
        <MyComplaints
          state={this.props.state}
          index={this.props.index}
          selectedIndex={this.state.selectedIndex}
          approvedComplaintsArray={this.state.approvedComplaintsArray}
          pendingComplaintsArray={this.state.pendingComplaintsArray}
          pledgeArray={this.props.pledgeArray}
          complain={this.complain}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <PastComplaints
          complaintsArray={this.state.complaintsArray}
          scrollPosition={this.props.scrollPosition}
        />

        <BottomNavigation id="complaints-tabs" selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="My Complaints"
            icon={<div></div>}
            onClick={() => this.select(0)}
          />
          <BottomNavigationItem
            label="Past Complaints"
            icon={<div></div>}
            onClick={() => this.select(1)}
          />
        </BottomNavigation>
      </div>
    )
  }
}
