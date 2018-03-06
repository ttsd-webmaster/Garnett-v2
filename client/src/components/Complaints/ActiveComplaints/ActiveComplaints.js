import '../Complaints.css';
import MyComplaints from './MyComplaints';
import PastComplaints from './PastComplaints';
import {loadFirebase} from '../../../helpers/functions.js';
import {LoadingComponent} from '../../../helpers/loaders.js';

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
      loaded: false,
      open: false,
      selectedIndex: 0,
      pledge: null,
      description: '',
      complaints: this.props.complaints,
      pendingComplaints: this.props.pendingComplaints,
      approvedComplaints: this.props.approvedComplaints
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let complaintsRef = firebase.database().ref('/approvedComplaints/');

        complaintsRef.on('value', (snapshot) => {
          let complaints = this.state.complaints;
          
          if (snapshot.val()) {
            complaints = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          console.log('Complaints Array: ', complaints);

          localStorage.setItem('activeComplaints', JSON.stringify(complaints));

          if (this.props.state.status === 'active') {
            let fullName = this.props.state.displayName;
            let userRef = firebase.database().ref('/users/' + fullName);

            userRef.on('value', (snapshot) => {
              let approvedComplaints = this.state.approvedComplaints;
              let pendingComplaints = this.state.pendingComplaints;

              if (snapshot.val().pendingComplaints) {
                pendingComplaints = Object.keys(snapshot.val().pendingComplaints).map(function(key) {
                  return snapshot.val().pendingComplaints[key];
                });
              }
              if (snapshot.val().approvedComplaints) {
                approvedComplaints = Object.keys(snapshot.val().approvedComplaints).map(function(key) {
                  return snapshot.val().approvedComplaints[key];
                });
              }

              localStorage.setItem('pendingComplaints', JSON.stringify(pendingComplaints));
              localStorage.setItem('approvedComplaints', JSON.stringify(approvedComplaints));

              this.setState({
                loaded: true,
                complaints: complaints,
                pendingComplaints: pendingComplaints,
                approvedComplaints: approvedComplaints
              });
            });
          }
          else {
            let pendingComplaintsRef = firebase.database().ref('/pendingComplaints/');

            pendingComplaintsRef.on('value', (snapshot) => {
              let pendingComplaints = [];

              if (snapshot.val()) {
                pendingComplaints = Object.keys(snapshot.val()).map(function(key) {
                  return snapshot.val()[key];
                });
              }

              localStorage.setItem('pendingComplaints', JSON.stringify(pendingComplaints));
              localStorage.setItem('approvedComplaints', JSON.stringify(complaints));

              this.setState({
                loaded: true,
                complaints: complaints,
                pendingComplaints: pendingComplaints,
                approvedComplaints: complaints
              });
            });
          }
        });
      })
      .catch(err => console.log(err));
    }
    else {
      this.setState({
        loaded: true
      });
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
      this.state.loaded ? (
        <div>
          <MyComplaints
            state={this.props.state}
            approvedComplaints={this.state.approvedComplaints}
            pendingComplaints={this.state.pendingComplaints}
            handleRequestOpen={this.props.handleRequestOpen}
          />
          <PastComplaints
            complaints={this.state.complaints}
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
            pledges={this.props.pledges}
            handleClose={this.handleClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
