import './PledgeApp.css';
import API from '../../api/API.js';
import loadFirebase from '../../helpers/loadFirebase.js';
import MeritBook from '../../components/MeritBook/MeritBook';
import Contacts from '../../components/Contacts/Contacts';
import Complaints from '../../components/Complaints/Complaints';
import Settings from '../../components/Settings/Settings';

import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import SwipeableViews from 'react-swipeable-views';

const inkBarStyle = {
  position: 'fixed',
  top: 100,
  backgroundColor: '#fff',
  zIndex: 1
};

const tabContainerStyle = {
  position: 'fixed',
  top: 52,
  zIndex: 1
};

let swipeableViewStyle = {
  backgroundColor: '#fafafa',
  marginTop: '100px'
};

const LoadableActiveMeritAllDialog = Loadable({
  loader: () => import('./ActiveMeritAllDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

export default class PledgeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Merit Book',
      slideIndex: 0,
      previousIndex: 0,
      scrollPosition1: 0,
      scrollPosition2: 0,
      scrollPosition3: 0,
      scrollPosition4: 0,
      loaded: false,
      open: false,
      message: '',
      openMerit: false,
      pledgeArray: [],
      meritArray: [],
      complaintsArray: []
    };
  }

  componentDidMount() {
    console.log('Pledge app mount: ', this.props.state.token)

    let token = localStorage.getItem('token');
    let firebaseData = JSON.parse(localStorage.getItem('firebaseData'));
    let firebase = window.firebase;

    if (navigator.onLine) {
      if (!this.props.state.token) {
        if (token !== null) {
          loadFirebase('app')
          .then(() => {
            firebase = window.firebase;

            if (!firebase.apps.length) {
              firebase.initializeApp(firebaseData);
            }

            loadFirebase('auth')
            .then(() => {
              firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                  API.getAuthStatus(user)
                  .then(res => {
                    this.getData(res.data.user, firebase);
                    this.props.loginCallBack(res);
                  });
                }
                else {
                  this.props.logoutCallBack();
                  this.props.history.push('/');
                }
              });
            });
          });
        }
        else {
          this.props.history.push('/');
        }
      }
      else {
        this.getData(this.props.state, firebase);
      }
    }
    else {
      let data = JSON.parse(localStorage.getItem('data'));

      if (token !== null) {
        if (data.data.user.status === 'active') {
          let pledgeArray = JSON.parse(localStorage.getItem('pledgeArray'));
          let activeArray = JSON.parse(localStorage.getItem('activeArray'));

          this.setState({
            loaded: true,
            pledgeArray: pledgeArray,
            activeArray: activeArray
          }, function() {
            let swipeContainer = document.querySelector('.react-swipeable-view-container');

            swipeContainer.classList.add('offline-height');
          });
        }
        else {
          let meritArray = JSON.parse(localStorage.getItem('meritArray'));
          let complaintsArray = JSON.parse(localStorage.getItem('complaintsArray'));
          let activeArray = JSON.parse(localStorage.getItem('activeArray'));

          this.setState({
            loaded: true,
            meritArray: meritArray,
            complaintsArray: complaintsArray,
            activeArray: activeArray
          }, function() {
            let swipeContainer = document.querySelector('.react-swipeable-view-container');

            swipeContainer.classList.add('offline-height');
          });
        }
      }
      else {
        this.props.history.push('/');
      }
    }

    // Changes view margin if view is pledge merit book
    if (this.props.state.status === 'pledge' && this.state.slideIndex === 0) {
      swipeableViewStyle.marginBottom = '50px';
    }
    else {
      swipeableViewStyle.marginBottom = 0;
    }

    window.onscroll = () => {
      let view = document.querySelector('.react-swipeable-view-container');
      let index = this.state.slideIndex;

      if (window.pageYOffset >= 1) {
        view.childNodes[index].style.touchAction = 'auto';
      } 
      else {
        view.childNodes[index].style.touchAction = 'pan-down';
      }
    };
  }

  // Changes view margin if view is pledge merit book
  componentDidUpdate() {
    if (this.props.state.status === 'pledge' && this.state.slideIndex === 0) {
      swipeableViewStyle.marginBottom = '50px';
    }
    else {
      swipeableViewStyle.marginBottom = 0;
    }
  }

  getData = (user, firebase) => {
    API.getActives()
    .then(response => {
      if (user.status === 'active') {
        loadFirebase('database')
        .then(() => {
          let dbRef = firebase.database().ref('/users/');
          let pledgeArray = [];

          dbRef.on('value', (snapshot) => {
            pledgeArray = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
            pledgeArray = pledgeArray.filter(function(user) {
              return user.status === 'pledge';
            });

            console.log('Pledge array: ', pledgeArray);
            console.log('Active array: ', response.data);

            localStorage.setItem('pledgeArray', JSON.stringify(pledgeArray));
            localStorage.setItem('activeArray', JSON.stringify(response.data));
            
            this.setState({
              loaded: true,
              pledgeArray: pledgeArray,
              activeArray: response.data
            });
          });
        });
      }
      else {
        loadFirebase('database')
        .then(() => {
          let fullName = user.firstName + user.lastName;
          let meritRef = firebase.database().ref('/users/' + fullName + '/Merits/');
          let complaintsRef = firebase.database().ref('/users/' + fullName + '/Complaints/');
          let meritArray = [];
          let complaintsArray = [];

          meritRef.on('value', (snapshot) => {
            if (snapshot.val()) {
              meritArray = Object.keys(snapshot.val()).map(function(key) {
                return snapshot.val()[key];
              });
            }

            complaintsRef.on('value', (snapshot) => {
              if (snapshot.val()) {
                complaintsArray = Object.keys(snapshot.val()).map(function(key) {
                  return snapshot.val()[key];
                });
              }

              console.log('Merit array: ', meritArray);
              console.log('Complaints array: ', complaintsArray);
              console.log('Active array: ', response.data);

              localStorage.setItem('meritArray', JSON.stringify(meritArray));
              localStorage.setItem('complaintsArray', JSON.stringify(complaintsArray));
              localStorage.setItem('activeArray', JSON.stringify(response.data));

              this.setState({
                loaded: true,
                meritArray: meritArray.reverse(),
                complaintsArray: complaintsArray.reverse(),
                activeArray: response.data
              });
            });
          });
        });
      }
    });
  }

  handleChange = (value) => {
    let title;
    let tabCount = this.state.tabCount;
    let previousIndex = this.state.previousIndex;
    let scrollPosition1 = this.state.scrollPosition1;
    let scrollPosition2 = this.state.scrollPosition2;
    let scrollPosition3 = this.state.scrollPosition3;
    let scrollPosition4 = this.state.scrollPosition4;
    let scrollPosition = window.pageYOffset;
    let scrolled;

    // Sets the title and marks scroll position based on the tab index
    if (value === 0) {
      title = 'Merit Book';
      scrolled = scrollPosition1;
    }
    else if (value === 1) {
      title = 'Contacts';
      scrolled = scrollPosition2;
    }
    else if (value === 2) {
      title = 'Complaints';
      scrolled = scrollPosition3;
    }
    else {
      title = 'Settings';
      scrolled = scrollPosition4;
    }

    // Updates the previous scroll position based on the previous index
    if (previousIndex === 0) {
      scrollPosition1 = scrollPosition;
    }
    else if (previousIndex === 1) {
      scrollPosition2 = scrollPosition;
    }
    else if (previousIndex === 2) {
      scrollPosition3 = scrollPosition;
    }
    else {
      scrollPosition4 = scrollPosition;
    }

    // Sets the window scroll position based on tab
    setTimeout(function() {
      window.scrollTo(0, scrolled);
    }, 1);

    this.setState({
      title: title,
      slideIndex: value,
      previousIndex: value,
      scrollPosition1: scrollPosition1,
      scrollPosition2: scrollPosition2,
      scrollPosition3: scrollPosition3,
      scrollPosition4: scrollPosition4
    });
  };

  handleRequestOpen = (message) => {
    this.setState({
      open: true,
      message: message
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  handleMeritOpen = () => {
    this.setState({
      openMerit: true
    });
  }

  handleMeritClose = () => {
    this.setState({
      openMerit: false
    });
  }

  render() {
    return (
      this.state.loaded ? (
        <div>
          <div className="app-header">
            {this.state.title}
          </div>
          <Tabs
            inkBarStyle={inkBarStyle}
            tabItemContainerStyle={tabContainerStyle}
            onChange={this.handleChange}
            value={this.state.slideIndex}
          >
            <Tab 
              icon={<i className="icon-star"></i>}
              value={0}
            />
            <Tab
              icon={<i className="icon-address-book"></i>}
              value={1}
            />
            <Tab
              icon={<i className="icon-thumbs-down-alt"></i>}
              value={2}
            />
            <Tab
              icon={<i className="icon-sliders"></i>}
              value={3} 
            />
          </Tabs>
          <SwipeableViews
            style={swipeableViewStyle}
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
            animateHeight
          >
            <MeritBook 
              state={this.props.state} 
              pledgeArray={this.state.pledgeArray}
              meritArray={this.state.meritArray}
              handleRequestOpen={this.handleRequestOpen}
            />
            <Contacts
              state={this.props.state}
              activeArray={this.state.activeArray}
            />
            <Complaints
              state={this.props.state}
              pledgeArray={this.state.pledgeArray}
              complaintsArray={this.state.complaintsArray}
              handleRequestOpen={this.handleRequestOpen}
            />
            <Settings 
              state={this.props.state} 
              logoutCallBack={this.props.logoutCallBack} 
              history={this.props.history}
            />
          </SwipeableViews>

          {this.state.slideIndex === 0 && (
            this.props.state.status === 'pledge' ? (
              <div className="total-merits"> 
                Total Merits: {this.props.state.totalMerits} 
              </div>
            ) : (
              <div>
                <div className="merit-button" onClick={this.handleMeritOpen}>
                  <i className="icon-pencil"></i>
                </div>
              </div>
            )
          )}

          <Snackbar
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
          <LoadableActiveMeritAllDialog
            open={this.state.openMerit}
            state={this.props.state}
            handleMeritOpen={this.handleMeritOpen}
            handleMeritClose={this.handleMeritClose}
            handleRequestOpen={this.handleRequestOpen}
          />
        </div>
      ) : (
        <div className="loading">
          <div className="loading-image"></div>
        </div>
      )
    )
  }
}