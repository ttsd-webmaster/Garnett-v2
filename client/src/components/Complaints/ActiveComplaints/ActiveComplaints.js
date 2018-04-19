import '../Complaints.css';
import MyComplaints from './Views/MyComplaints';
import PastComplaints from './Views/PastComplaints';
import {loadFirebase} from '../../../helpers/functions.js';
import {LoadingComponent} from '../../../helpers/loaders.js';

import React, {Component} from 'react';
import {forceCheck} from 'react-lazyload';
import Loadable from 'react-loadable';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

const LoadableAddComplaintDialog = Loadable({
  loader: () => import('./Dialogs/AddComplaintDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export default class ActiveComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      open: false,
      selectedIndex: 0,
      scrollPosition1: 0,
      scrollPosition2: 0,
      pledge: null,
      description: '',
      complaints: this.props.complaints,
      pendingComplaints: this.props.pendingComplaints,
      approvedComplaints: this.props.approvedComplaints
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let dbRef = firebase.database().ref('/');

        dbRef.on('value', (snapshot) => {
          let complaints = [];
          let pendingComplaints = [];
          let approvedComplaints = [];
          
          if (snapshot.val().pendingComplaints) {
            pendingComplaints = Object.keys(snapshot.val().pendingComplaints).map(function(key) {
              return snapshot.val().pendingComplaints[key];
            }).sort((a, b) => {
              return a.date < b.date ? 1 : -1;
            });

            if (this.props.state.status !== 'pipm') {
              pendingComplaints = pendingComplaints.filter((complaint) => {
                return this.props.state.name === complaint.activeName;
              });
            }
          }
          
          if (snapshot.val().approvedComplaints) {
            approvedComplaints = Object.keys(snapshot.val().approvedComplaints).map(function(key) {
              return snapshot.val().approvedComplaints[key];
            }).sort((a, b) => {
              return a.date < b.date ? 1 : -1;
            });

            complaints = approvedComplaints;

            if (this.props.state.status !== 'pipm') {
              approvedComplaints = approvedComplaints.filter((complaint) => {
                return this.props.state.name === complaint.activeName;
              });
            }
          }

          console.log('Complaints: ', complaints);
          console.log('Pending Complaints: ', pendingComplaints);
          console.log('Approved Complaints: ', approvedComplaints);

          localStorage.setItem('activeComplaints', JSON.stringify(complaints));
          localStorage.setItem('pendingComplaints', JSON.stringify(pendingComplaints));
          localStorage.setItem('approvedComplaints', JSON.stringify(approvedComplaints));

          this.setState({
            loaded: true,
            complaints: complaints,
            pendingComplaints: pendingComplaints,
            approvedComplaints: approvedComplaints
          });
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

  componentDidUpdate() {
    let addComplaint = document.getElementById('add-complaint');
    let complaintsTabs = document.getElementById('complaints-tabs');
    
    // Changes complaints tabs and add button to be viewable if slide is on complaints
    if (addComplaint && complaintsTabs) {
      if (this.props.state.status !== 'pledge' && this.props.index === 3) {
        addComplaint.parentNode.classList.remove('hidden');
        complaintsTabs.style.display = 'flex';
      }
      else {
        addComplaint.parentNode.classList.add('hidden');
        complaintsTabs.style.display = 'none';
      }
    }
  }

  select = (index) => {
    let previousIndex = this.state.selectedIndex;
    let scrollPosition1 = this.state.scrollPosition1;
    let scrollPosition2 = this.state.scrollPosition2;
    let contentContainer = document.querySelector('.content-container');
    let scrollPosition = contentContainer.childNodes[3].scrollTop;
    let myComplaints = document.getElementById('my-complaints');
    let pastComplaints = document.getElementById('past-complaints');
    let scrolled;

    if (previousIndex !== index) {
      myComplaints.classList.toggle('active');
      pastComplaints.classList.toggle('active');
    }

    if (index === 0) {
      scrolled = scrollPosition1;
    }
    else {
      scrolled = scrollPosition2;
    }

    if (previousIndex === 0) {
      scrollPosition1 = scrollPosition;
    }
    else {
      scrollPosition2 = scrollPosition;
    }

    // Sets the window scroll position based on tab
    contentContainer.childNodes[3].scrollTop = scrolled;

    forceCheck();

    this.setState({
      selectedIndex: index,
      scrollPosition1: scrollPosition1,
      scrollPosition2: scrollPosition2
    });
  }

  handleOpen = () => {
    if (navigator.onLine) {
      this.setState({
        open: true
      });

      // Handles android back button
      if (/android/i.test(navigator.userAgent)) {
        let path;
        if (process.env.NODE_ENV === 'development') {
          path = 'http://localhost:3000';
        }
        else {
          path = 'https://garnett-app.herokuapp.com';
        }

        window.history.pushState(null, null, path + window.location.pathname);
        window.onpopstate = () => {
          this.handleClose();
        }
      }
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }
  }

  handleClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

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
          />

          <BottomNavigation 
            id="complaints-tabs" 
            className="bottom-tabs"
            style={{'display': 'none'}}
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

          <FloatingActionButton id="add-complaint" className="fixed-button hidden" onClick={this.handleOpen}>
            <i className="icon-pencil"></i>
          </FloatingActionButton>

          <LoadableAddComplaintDialog
            open={this.state.open}
            state={this.props.state}
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
