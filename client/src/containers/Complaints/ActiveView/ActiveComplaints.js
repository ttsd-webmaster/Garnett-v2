import MyComplaints from './components/MyComplaints';
import PastComplaints from './components/PastComplaints';
import { loadFirebase, androidBackOpen, androidBackClose } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { LoadableAddComplaintDialog } from './components/Dialogs';

import React, { Component } from 'react';
import { Portal } from 'react-portal';
import { forceCheck } from 'react-lazyload';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

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
      complaints: [],
      pendingComplaints: [],
      approvedComplaints: [],
      reverse: false
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const dbRef = firebase.database().ref('/');

        dbRef.on('value', (snapshot) => {
          let complaints = [];
          let pendingComplaints = [];
          let approvedComplaints = [];
          
          if (snapshot.val().pendingComplaints) {
            pendingComplaints = Object.keys(snapshot.val().pendingComplaints).map(function(key) {
              return snapshot.val().pendingComplaints[key];
            }).sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
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
              return new Date(b.date) - new Date(a.date);
            });

            complaints = approvedComplaints;

            if (this.props.state.status !== 'pipm') {
              approvedComplaints = approvedComplaints.filter((complaint) => {
                return this.props.state.name === complaint.activeName;
              });
            }
          }

          localStorage.setItem('activeComplaints', JSON.stringify(complaints));
          localStorage.setItem('pendingComplaints', JSON.stringify(pendingComplaints));
          localStorage.setItem('approvedComplaints', JSON.stringify(approvedComplaints));

          this.setState({
            loaded: true,
            complaints,
            pendingComplaints,
            approvedComplaints
          });
        });
      })
      .catch(error => console.log(`Error: ${error}`));
    }
    else {
      const activeComplaints = localStorage.getItem('activeComplaints');
      const pendingComplaints = localStorage.getItem('pendingComplaints');
      const approvedComplaints = localStorage.getItem('approvedComplaints');
      this.setState({
        loaded: true,
        complaints,
        pendingComplaints,
        approvedComplaints
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
    let { scrollPosition1, scrollPosition2 } = this.state;
    let contentContainer = document.getElementById('content-container');
    const scrollPosition = contentContainer.childNodes[3].scrollTop;
    const myComplaints = document.getElementById('my-complaints');
    const pastComplaints = document.getElementById('past-complaints');
    let scrolled;

    if (previousIndex !== index) {
      myComplaints.classList.toggle('active');
      pastComplaints.classList.toggle('active');

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
        scrollPosition1,
        scrollPosition2
      });
    }
  }

  handleOpen = () => {
    if (navigator.onLine) {
      androidBackOpen(this.handleClose);
      this.setState({ open: true });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleClose = () => {
    androidBackClose();
    this.setState({ open: false });
  }

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingComponent />
    }
    
    return (
      <div>
        <MyComplaints
          state={this.props.state}
          approvedComplaints={this.state.approvedComplaints}
          pendingComplaints={this.state.pendingComplaints}
          handleRequestOpen={this.props.handleRequestOpen}
          reverse={this.state.reverse}
          reverseComplaints={this.reverse}
        />
        <PastComplaints
          complaints={this.state.complaints}
          reverse={this.state.reverse}
          reverseComplaints={this.reverse}
        />

        <Portal>
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
        </Portal>

        <Portal>
          <FloatingActionButton id="add-complaint" className="fixed-button hidden" onClick={this.handleOpen}>
            <i className="icon-pencil"></i>
          </FloatingActionButton>
        </Portal>

        <LoadableAddComplaintDialog
          open={this.state.open}
          state={this.props.state}
          handleClose={this.handleClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      </div>
    )
  }
}
