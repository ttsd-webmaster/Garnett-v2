import './PledgeApp.css';

import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import ActiveMerit from '../../components/ActiveMerit/ActiveMerit';
import PledgeMerit from '../../components/PledgeMerit/PledgeMerit';
import Settings from '../../components/Settings/Settings';
import API from "../../api/API.js";
const firebase = window.firebase;

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
    return <ActiveMerit state={props.state} userArray={props.userArray} />;
  }
  else {
    return <PledgeMerit meritArray={props.meritArray} totalMerits={props.state.totalMerits} />;
  }
}

export default class PledgeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Merit Book',
      slideIndex: 0,
      loaded: false,
      userArray: [],
      meritArray: []
    };
  }

  componentDidMount() {
    console.log('Pledge app mount: ', this.props.state.token)

    if (this.props.state.status === 'active') {
      firebase.auth().signInWithCustomToken(this.props.state.token)
      .then(() => {
        let dbRef = firebase.database().ref('/users/');
        let userArray = [];

        dbRef.on('value', (snapshot) => {
          userArray = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          });
          userArray = userArray.filter(function(user) {
            return user.status === 'pledge';
          })
          console.log("Pledge array: ", userArray);
          
          this.setState({
            loaded: true,
            userArray: userArray
          })
        })
      })
      .catch(function(error) {
        console.log("Token error: ", error);
      });
    }
    else {
      API.getMerits(this.props.state.token)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            loaded: true,
            meritArray: res.data
          });
          console.log('meritArray: ', this.state.meritArray);
        }
      })
      .catch(err => console.log('err', err));
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

  handleChange = (value) => {
    let title;

    if (value === 0) {
      title = 'Merit Book';
    }
    else if (value === 1) {
      title = 'Chalkboards';
    }
    else {
      title = 'Settings';
    }

    this.setState({
      title: title,
      slideIndex: value,
    });
  };

  render() {
    return (
      this.state.loaded ? (
        <div>
          <div className="app-header">
            {this.state.title}
          </div>
          <Tabs
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
              icon={<i className="icon-sliders"></i>}
              value={2} 
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
              userArray={this.state.userArray}
              meritArray={this.state.meritArray}
            />
            <div> Chalkboards </div>
            <Settings 
              state={this.props.state} 
              logOutCallBack={this.props.logOutCallBack} 
              history={this.props.history}
            />
          </SwipeableViews>

          {this.state.slideIndex === 0 ? (
            this.props.state.status === 'pledge' ? (
              <div className="total-merits"> Total Merits: {this.props.state.totalMerits} </div>
            ) : (
              <div className="merit-button">+</div>
            )
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <div className="loading">
          <div className="loading-image"></div>
        </div>
      )
    )
  }
}