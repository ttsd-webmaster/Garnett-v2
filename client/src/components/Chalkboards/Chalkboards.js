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
      myUpcomingChalkboards: [],
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
        let upcomingChalkboardsRef = firebase.database().ref('/upcomingChalkboards/');

        upcomingChalkboardsRef.on('value', (snapshot) => {
          let upcomingChalkboards = this.state.upcomingChalkboards;
          let userRef = firebase.database().ref('/users/' + this.props.state.displayName);
          
          if (snapshot.val()) {
            upcomingChalkboards = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          localStorage.setItem('upcomingChalkboards', JSON.stringify(upcomingChalkboards));

          userRef.on('value', (snapshot) => {
            let myUpcomingChalkboards = this.state.myUpcomingChalkboards;

            if (snapshot.val().upcomingChalkboards) {
              myUpcomingChalkboards = Object.keys(snapshot.val().upcomingChalkboards).map(function(key) {
                return snapshot.val().upcomingChalkboards[key];
              });
            }

            localStorage.setItem('myUpcomingChalkboards', JSON.stringify(myUpcomingChalkboards));

            this.setState({
              upcomingChalkboards: upcomingChalkboards,
              myUpcomingChalkboards: myUpcomingChalkboards
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
          myUpcomingChalkboards={this.state.myUpcomingChalkboards}
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
