import '../Complaints.css';
import {loadFirebase} from '../../../helpers/functions.js';
import MyComplaints from './MyComplaints';
import PastComplaints from './PastComplaints';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

const LoadableAddComplaintDialog = Loadable({
  loader: () => import('./AddComplaintDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

export default class ActiveComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedIndex: 0,
      pledge: null,
      description: '',
      complaintsArray: this.props.complaintsArray,
      pendingComplaintsArray: this.props.pendingComplaintsArray,
      approvedComplaintsArray: this.props.approvedComplaintsArray
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let complaintsRef = firebase.database().ref('/approvedComplaints/');

        complaintsRef.on('value', (snapshot) => {
          let complaintsArray = this.props.complaintsArray;
          
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

              localStorage.setItem('pendingComplaintsArray', JSON.stringify(pendingComplaintsArray));
              localStorage.setItem('approvedComplaintsArray', JSON.stringify(approvedComplaintsArray));

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

              localStorage.setItem('pendingComplaintsArray', JSON.stringify(pendingComplaintsArray));
              localStorage.setItem('approvedComplaintsArray', JSON.stringify(complaintsArray));

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

  handleOpen = () => {
    if (navigator.onLine) {
      this.setState({
        open: true
      });
    }
    else {
      this.handleRequestOpen('You are offline.');
    }
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div>
        <MyComplaints
          state={this.props.state}
          approvedComplaintsArray={this.state.approvedComplaintsArray}
          pendingComplaintsArray={this.state.pendingComplaintsArray}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <PastComplaints
          complaintsArray={this.state.complaintsArray}
          scrollPosition={this.props.scrollPosition}
        />

        <BottomNavigation 
          id="complaints-tabs" 
          className="bottom-tabs" 
          selectedIndex={this.state.selectedIndex}
        >
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

        <div id="add-complaint" className="fixed-button hidden" onClick={this.handleOpen}>
          <i className="icon-pencil"></i>
        </div>

        <LoadableAddComplaintDialog
          open={this.state.open}
          state={this.props.state}
          pledgeArray={this.props.pledgeArray}
          handleClose={this.handleClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      </div>
    )
  }
}
