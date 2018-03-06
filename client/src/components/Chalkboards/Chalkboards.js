import {getDate} from '../../helpers/functions.js';

import './Chalkboards.css';
import {loadFirebase} from '../../helpers/functions.js';
import MyChalkboards from './MyChalkboards';
import AllChalkboards from './AllChalkboards';

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
    return <div> Loading... </div>;
  }
});

export default class Chalkboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedIndex: 0,
      myHostingChalkboards: [],
      myAttendingChalkboards: [],
      myCompletedChalkboards: [],
      upcomingChalkboards: [],
      completedChalkboards: []
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let userChalkboardsRef = firebase.database().ref('/users/' + this.props.state.displayName + '/chalkboards');

        userChalkboardsRef.on('value', (snapshot) => {
          let myChalkboards = [];
          let chalkboardsRef = firebase.database().ref('/chalkboards/');

          if (snapshot.val()) {
            myChalkboards = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });

            myChalkboards.sort(function(a, b) {
              return b.date < a.date;
            });
          }
          
          chalkboardsRef.on('value', (snapshot) => {
            let chalkboards = [];
            let upcomingChalkboards = [];
            let completedChalkboards = [];
            let myHostingChalkboards = [];
            let myAttendingChalkboards = [];
            let myCompletedChalkboards = [];
            let today = getDate();
            
            if (snapshot.val()) {
              chalkboards = Object.keys(snapshot.val()).map(function(key) {
                return snapshot.val()[key];
              });

              chalkboards = chalkboards.filter(chalkboard => myChalkboards.includes(chalkboard));

              chalkboards.sort(function(a, b) {
                return b.date < a.date;
              });

              chalkboards.forEach(function(chalkboard) {
                let attendees = Object.keys(chalkboard.attendees).map(function(key) {
                  return chalkboard.attendees[key];
                });

                attendees.forEach(function(attendee) {
                  if (this.props.state.name === attendee.name) {
                    myAttendingChalkboards.push(chalkboard);
                  }
                });

                if (chalkboard.date >= today) {
                  upcomingChalkboards.push(chalkboard);
                }
                else {
                  completedChalkboards.push(chalkboard);
                }
              });

              myChalkboards = myChalkboards.concat(myAttendingChalkboards);

              myChalkboards.forEach((chalkboard) => {
                if (chalkboard.date >= today) {
                  if (this.props.state.displayName === chalkboard.displayName) {
                    myHostingChalkboards.push(chalkboard);
                  }
                  else {
                    myAttendingChalkboards.push(chalkboard);
                  }
                }
                else {
                  myCompletedChalkboards.push(chalkboard);
                }
              });
            }

            localStorage.setItem('upcomingChalkboards', JSON.stringify(upcomingChalkboards));
            localStorage.setItem('completedChalkboards', JSON.stringify(completedChalkboards));
            localStorage.setItem('myHostingChalkboards', JSON.stringify(myHostingChalkboards));
            localStorage.setItem('myAttendingChalkboards', JSON.stringify(myAttendingChalkboards));
            localStorage.setItem('myCompletedChalkboards', JSON.stringify(myCompletedChalkboards));

            this.setState({
              upcomingChalkboards: upcomingChalkboards,
              completedChalkboards: completedChalkboards,
              myHostingChalkboards: myHostingChalkboards,
              myAttendingChalkboards: myAttendingChalkboards,
              myCompletedChalkboards: myCompletedChalkboards
            });
          });
        });
      });
    }
  }

  select = (index) => {
    let previousIndex = this.state.selectedIndex;
    let myChalkboards = document.getElementById('my-chalkboards');
    let allChalkboards = document.getElementById('all-chalkboards');

    if (previousIndex !== index) {
      myChalkboards.classList.toggle('active');
      allChalkboards.classList.toggle('active');
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
        <MyChalkboards
          state={this.props.state}
          myHostingChalkboards={this.state.myHostingChalkboards}
          myAttendingChalkboards={this.state.myAttendingChalkboards}
          myCompletedChalkboards={this.state.myCompletedChalkboards}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        <AllChalkboards
          upcomingChalkboards={this.state.upcomingChalkboards}
          completedChalkboards={this.state.completedChalkboards}
        />

        <BottomNavigation 
          id="chalkboards-tabs" 
          className="bottom-tabs" 
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

        {this.props.state.status === 'pledge' ? (
          null
        ) : (
          <div>
            <div id="add-chalkboard" className="fixed-button hidden" onClick={this.handleOpen}>
              <i className="icon-calendar-plus-o"></i>
            </div>

            <LoadableAddChalkboardDialog
              open={this.state.open}
              state={this.props.state}
              handleClose={this.handleClose}
              handleRequestOpen={this.props.handleRequestOpen}
            />
          </div>
        )}
      </div>
    )
  }
}
