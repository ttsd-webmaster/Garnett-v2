import './Chalkboards.css';
import MyChalkboards from './MyChalkboards';
import AllChalkboards from './AllChalkboards';
import API from "../../api/API.js";
import {loadFirebase, getDate} from '../../helpers/functions.js';
import {LoadingComponent} from '../../helpers/loaders.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

const LoadableAddChalkboardDialog = Loadable({
  loader: () => import('./AddChalkboardDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

const LoadableHandleChalkboardDialog = Loadable({
  loader: () => import('./HandleChalkboardDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export default class Chalkboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      open: false,
      openAdd: false,
      selectedIndex: 0,
      scrollPosition1: 0,
      scrollPosition2: 0,
      myHostingChalkboards: this.props.myHostingChalkboards,
      myAttendingChalkboards: this.props.myAttendingChalkboards,
      myCompletedChalkboards: this.props.myCompletedChalkboards,
      upcomingChalkboards: this.props.upcomingChalkboards,
      completedChalkboards: this.props.completedChalkboards,
      selectedChalkboard: null,
      chalkboardType: '',
      attendees: []
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let chalkboardsRef = firebase.database().ref('/chalkboards');

        chalkboardsRef.on('value', (snap) => {
          let chalkboards = [];
          let today = getDate();
          let myChalkboardsRef = firebase.database().ref('/users/' + this.props.state.displayName + '/chalkboards');
          
          // Checks if there are any chalkboards
          if (snap.val()) {
            myChalkboardsRef.on('value', (snapshot) => {
              let myChalkboards = [];
              let myHostingChalkboards = [];
              let myAttendingChalkboards = [];
              let myCompletedChalkboards = [];
              let upcomingChalkboards = [];
              let completedChalkboards = [];

              // Converts object to array
              chalkboards = Object.keys(snap.val()).map(function(key) {
                return snap.val()[key];
              });

              chalkboards.sort(function(a, b) {
                return b.date < a.date;
              });

              // Checks which chalkboards I am attending and which ones I have completed
              chalkboards.forEach((chalkboard) => {
                if (chalkboard.attendees) {
                  let attendees = Object.keys(chalkboard.attendees).map(function(key) {
                    return chalkboard.attendees[key];
                  });

                  attendees.forEach((attendee) => {
                    if (this.props.state.name === attendee.name) {
                      if (chalkboard.date >= today) {
                        myAttendingChalkboards.push(chalkboard);
                      }
                      else {
                        myCompletedChalkboards.push(chalkboard);
                      }
                    }
                  });
                }
              });

              // Checks if user has any chalkboards
              if (snapshot.val()) {
                // Converts object to array
                myChalkboards = Object.keys(snapshot.val()).map(function(key) {
                  return snapshot.val()[key];
                });

                myChalkboards.sort(function(a, b) {
                  return b.date < a.date;
                });

                // Splits my chalkboards to hosting and completed
                myChalkboards.forEach((chalkboard) => {
                  if (chalkboard.date >= today) {
                    myHostingChalkboards.push(chalkboard);
                  }
                  else {
                    myCompletedChalkboards.push(chalkboard);
                  }
                });
              }

              // Combines my chalkboards I am hosting with the ones I am attending
              myChalkboards = myChalkboards.concat(myAttendingChalkboards);

              // Filters chalkboards so it does not include ones in my chalkboards
              for (let i = 0, len = myChalkboards.length; i < len; i++) { 
                for (let j = 0, len2 = chalkboards.length; j < len2; j++) {
                    if (myChalkboards[i].title === chalkboards[j].title) {
                      chalkboards.splice(j, 1);
                      len2 = chalkboards.length
                    }
                }
              }

              // Splits the remaining chalkboards to upcoming and completed
              chalkboards.forEach((chalkboard) => {
                if (chalkboard.date >= today) {
                  upcomingChalkboards.push(chalkboard);
                }
                else {
                  completedChalkboards.push(chalkboard);
                }
              })

              myCompletedChalkboards.sort(function(a, b) {
                return b.date < a.date;
              });

              console.log('Upcoming Chalkboards: ', upcomingChalkboards);
              console.log('My Hosting Chalkboards: ', myHostingChalkboards);
              console.log('My Attending Chalkboards: ', myAttendingChalkboards);
              console.log('My Completed Chalkboards: ', myCompletedChalkboards);

              localStorage.setItem('upcomingChalkboards', JSON.stringify(upcomingChalkboards));
              localStorage.setItem('completedChalkboards', JSON.stringify(completedChalkboards));
              localStorage.setItem('myHostingChalkboards', JSON.stringify(myHostingChalkboards));
              localStorage.setItem('myAttendingChalkboards', JSON.stringify(myAttendingChalkboards));
              localStorage.setItem('myCompletedChalkboards', JSON.stringify(myCompletedChalkboards));

              this.setState({
                loaded: true,
                upcomingChalkboards: upcomingChalkboards,
                completedChalkboards: completedChalkboards,
                myHostingChalkboards: myHostingChalkboards,
                myAttendingChalkboards: myAttendingChalkboards,
                myCompletedChalkboards: myCompletedChalkboards
              });
            });
          }
        });
      });
    }
    else {
      this.setState({
        loaded: true
      });
    }
  }

  componentDidUpdate() {
    let addChalkboard = document.getElementById('add-chalkboard');
    let chalkboardsTabs = document.getElementById('chalkboards-tabs');

    // Changes chalkboards tabs and add button to be viewable if slide is on chalkboards
    if (chalkboardsTabs) {
      if (this.props.index === 2) {
        chalkboardsTabs.style.display = 'flex';
        if (this.props.state.status !== 'pledge') {
          addChalkboard.style.display = 'flex';
        }
      }
      else {
        chalkboardsTabs.style.display = 'none';
        if (this.props.state.status !== 'pledge') {
          addChalkboard.style.display = 'none';
        }
      }
    }
  }

  select = (index) => {
    let previousIndex = this.state.selectedIndex;
    let scrollPosition1 = this.state.scrollPosition1;
    let scrollPosition2 = this.state.scrollPosition2;
    let contentContainer = document.querySelector('.content-container');
    let scrollPosition = contentContainer.childNodes[2].scrollTop;
    let myChalkboards = document.getElementById('my-chalkboards');
    let allChalkboards = document.getElementById('all-chalkboards');
    let scrolled;

    if (previousIndex !== index) {
      myChalkboards.classList.toggle('active');
      allChalkboards.classList.toggle('active');
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
    contentContainer.childNodes[2].scrollTop = scrolled;

    this.setState({
      selectedIndex: index,
      scrollPosition1: scrollPosition1,
      scrollPosition2: scrollPosition2
    });
  }

  addOpen = () => {
    if (navigator.onLine) {
      this.setState({
        openAdd: true
      });
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }
  }

  addClose = () => {
    this.setState({
      openAdd: false
    });
  }

  handleOpen = (chalkboard, type) => {
    if (navigator.onLine) {
      API.getAttendees(chalkboard)
      .then((res) => {
        this.setState({
          open: true,
          selectedChalkboard: chalkboard,
          chalkboardType: type,
          attendees: res.data
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.props.handleRequestOpen('There was an error retrieving the attendees');
      });
    }
    else {
      this.props.handleRequestOpen('You are offline.');
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
          <MyChalkboards
            state={this.props.state}
            myHostingChalkboards={this.state.myHostingChalkboards}
            myAttendingChalkboards={this.state.myAttendingChalkboards}
            myCompletedChalkboards={this.state.myCompletedChalkboards}
            handleOpen={this.handleOpen}
            handleRequestOpen={this.props.handleRequestOpen}
          />
          <AllChalkboards
            upcomingChalkboards={this.state.upcomingChalkboards}
            completedChalkboards={this.state.completedChalkboards}
            handleOpen={this.handleOpen}
            handleRequestOpen={this.props.handleRequestOpen}
          />

          <BottomNavigation 
            id="chalkboards-tabs" 
            className="bottom-tabs"
            style={{'display': 'none'}}
            selectedIndex={this.state.selectedIndex}
          >
            <BottomNavigationItem
              label="My Chalkboards"
              icon={<div></div>}
              onClick={() => this.select(0)}
            />
            <BottomNavigationItem
              label="All Chalkboards"
              icon={<div></div>}
              onClick={() => this.select(1)}
            />
          </BottomNavigation>

          {this.props.state.status !== 'pledge' && (
            <div>
              <div id="add-chalkboard" className="fixed-button hidden" onClick={this.addOpen}>
                <i className="icon-calendar-plus-o"></i>
              </div>

              <LoadableAddChalkboardDialog
                open={this.state.openAdd}
                state={this.props.state}
                handleClose={this.addClose}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </div>
          )}

          <LoadableHandleChalkboardDialog
            open={this.state.open}
            state={this.props.state}
            type={this.state.chalkboardType}
            chalkboard={this.state.selectedChalkboard}
            attendees={this.state.attendees}
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