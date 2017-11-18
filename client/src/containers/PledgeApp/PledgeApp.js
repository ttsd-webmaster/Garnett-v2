import './PledgeApp.css';

import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import SwipeableViews from 'react-swipeable-views';
import firebase from '@firebase/app';
import '@firebase/database';

import ActiveMerit from '../../components/MeritBook/ActiveMerit/ActiveMerit';
import PledgeMerit from '../../components/MeritBook/PledgeMerit/PledgeMerit';
import ActiveComplaints from '../../components/Complaints/ActiveComplaints/ActiveComplaints';
import PledgeComplaints from '../../components/Complaints/PledgeComplaints/PledgeComplaints';
import Settings from '../../components/Settings/Settings';
import API from "../../api/API.js";

const inkBarStyle = {
  position: 'relative',
  top: '98px',
  zIndex: 1
};

const tabContainerStyle = {
  position: 'fixed',
  top: 50,
  zIndex: 1
};

let swipeableViewStyle = {
  height: 'calc(100vh - 100px)',
  backgroundColor: '#fafafa',
  marginTop: '100px'
};

function MeritBook(props) {
  const isActive = props.state.status;

  if (isActive === 'active') {
    return (
      <ActiveMerit 
        state={props.state} 
        pledgeArray={props.pledgeArray} 
        handleRequestOpen={props.handleRequestOpen} 
      />
    );
  }
  else {
    return <PledgeMerit meritArray={props.meritArray} totalMerits={props.state.totalMerits} />;
  }
}

function Complaints(props) {
  const isActive = props.state.status;

  if (isActive === 'active') {
    return (
      <ActiveComplaints 
        state={props.state} 
        pledgeArray={props.pledgeArray}
        handleRequestOpen={props.handleRequestOpen}
      />
    );
  }
  else {
    return <PledgeComplaints complaintsArray={props.complaintsArray} />;
  }
}

export default class PledgeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Merit Book',
      slideIndex: 0,
      loaded: false,
      open: false,
      message: '',
      pledgeArray: [],
      meritArray: [],
      complaintsArray: []
    };
  }

  componentDidMount() {
    console.log('Pledge app mount: ', this.props.state.token)

    if (!this.props.state.token) {
      let token = localStorage.getItem('token');

      API.getAuthStatus(token)
      .then(res => {
        if (res.data !== 'Not Authenticated') {
          if (!firebase.apps.length) {
            firebase.initializeApp({databaseURL: res.data.databaseURL});
          }

          this.getData(res.data.user.status, token);
          this.props.loginCallBack(res);
        }
        else {
          this.props.history.push('/');
        }
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.getData(this.props.state.status, this.props.state.token);
    }

    // Changes view height if view is pledge merit book
    if (this.props.state.status === 'pledge' && this.state.slideIndex === 0) {
      swipeableViewStyle.height = 'calc(100vh - 140px)';
      swipeableViewStyle.marginBottom = '40px';
    }
    else {
      swipeableViewStyle.height = 'calc(100vh - 100px)';
      swipeableViewStyle.marginBottom = '0px';
    }
  }

  // Changes view height if view is pledge merit book
  componentDidUpdate() {
    if (this.props.state.status === 'pledge' && this.state.slideIndex === 0) {
      swipeableViewStyle.height = 'calc(100vh - 140px)';
      swipeableViewStyle.marginBottom = '40px';
    }
    else {
      swipeableViewStyle.height = 'calc(100vh - 100px)';
      swipeableViewStyle.marginBottom = '0px';
    }
  }

  getData = (userStatus, token) => {
    if (userStatus === 'active') {
      let dbRef = firebase.database().ref('/users/');
      let pledgeArray = [];

      dbRef.on('value', (snapshot) => {
        pledgeArray = Object.keys(snapshot.val()).map(function(key) {
          return snapshot.val()[key];
        });
        pledgeArray = pledgeArray.filter(function(user) {
          return user.status === 'pledge';
        });
        console.log("Pledge array: ", pledgeArray);
        
        this.setState({
          loaded: true,
          pledgeArray: pledgeArray
        });
      });
    }
    else {
      API.getPledgeData(token)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            loaded: true,
            meritArray: res.data.meritArray,
            complaintsArray: res.data.complaintsArray
          });
          console.log('meritArray: ', this.state.meritArray);
          console.log('complaintsArray: ', this.state.complaintsArray);
        }
      })
      .catch(err => console.log('err', err));
    }
  }

  handleChange = (value) => {
    let title;

    if (value === 0) {
      title = 'Merit Book';
    }
    else if (value === 1) {
      title = 'Chalkboards';
    }
    else if (value === 2) {
      title = 'Complaints';
    }
    else {
      title = 'Settings';
    }

    this.setState({
      title: title,
      slideIndex: value,
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
              icon={<i className="icon-address-book"></i>}
              value={0}
            />
            <Tab
              icon={<i className="icon-calendar-empty"></i>}
              value={1}
            />
            <Tab
              icon={<i className="icon-thumbs-down"></i>}
              value={2}
            />
            <Tab
              icon={<i className="icon-sliders"></i>}
              value={3} 
            />
          </Tabs>
          <SwipeableViews
            style={swipeableViewStyle}
            animateHeight={true}
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <MeritBook 
              state={this.props.state} 
              pledgeArray={this.state.pledgeArray}
              meritArray={this.state.meritArray}
              handleRequestOpen={this.handleRequestOpen}
            />
            <div> Chalkboards </div>
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

          {this.state.slideIndex === 0 ? (
            this.props.state.status === 'pledge' ? (
              <div className="total-merits"> Total Merits: {this.props.state.totalMerits} </div>
            ) : (
              <div>
                <div className="merit-button">+</div>
              </div>
            )
          ) : (
            <div></div>
          )}

          <Snackbar
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
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