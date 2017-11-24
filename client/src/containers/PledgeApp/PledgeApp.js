import './PledgeApp.css';
import API from '../../api/API.js';
import loadFirebase from '../../loadFirebase.js';
import MeritBook from '../../components/MeritBook/MeritBook';
import Contacts from '../../components/Contacts/Contacts';
import Complaints from '../../components/Complaints/Complaints';
import Settings from '../../components/Settings/Settings';

import React, {Component} from 'react';
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
      loaded: false,
      open: false,
      message: '',
      openMerit: false,
      description: '',
      amount: '',
      descriptionValidation: true,
      amountValidation: true,
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
        if (res.status === 200) {
          loadFirebase('app')
          .then(() => {
            let firebase = window.firebase;

            if (!firebase.apps.length) {
              firebase.initializeApp({databaseURL: res.data.databaseURL});
            }

            this.getData(res.data.user);
            this.props.loginCallBack(res);
          });
        }
        else {
          this.props.history.push('/');
        }
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.getData(this.props.state);
    }

    // Changes view height if view is pledge merit book
    if (this.props.state.status === 'pledge' && this.state.slideIndex === 0) {
      swipeableViewStyle.marginBottom = '50px';
    }
    else {
      swipeableViewStyle.marginBottom = 0;
    }
  }

  // Changes view height if view is pledge merit book
  componentDidUpdate() {
    if (this.props.state.status === 'pledge' && this.state.slideIndex === 0) {
      swipeableViewStyle.marginBottom = '50px';
    }
    else {
      swipeableViewStyle.marginBottom = 0;
    }
  }

  getData = (user) => {
    API.getActives()
    .then(response => {
      if (user.status === 'active') {
        loadFirebase('database')
        .then(() => {
          let firebase = window.firebase;
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
          let firebase = window.firebase;
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

              this.setState({
                loaded: true,
                meritArray: meritArray,
                complaintsArray: complaintsArray,
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

    if (value === 0) {
      title = 'Merit Book';
    }
    else if (value === 1) {
      title = 'Contacts';
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

  handleMeritChange = (label, newValue) => {
    let validationLabel = [label] + 'Validation';
    let value = newValue;

    if (label === 'amount') {
      value = parseInt(newValue)
    }

    this.setState({
      [label]: value,
      [validationLabel]: true
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

  meritAll = () => {
    let token = this.props.state.token;
    let activeName = this.props.state.name;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let descriptionValidation = true;
    let amountValidation = true;

    if (!description || !amount || amount > 30 || amount < 0) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount || amount > 30 || amount < 0) {
        amountValidation = false;
      }

      this.setState({
        descriptionValidation: descriptionValidation,
        amountValidation: amountValidation,
      });
    }
    else {
      API.meritAll(token, activeName, description, amount, photoURL)
      .then(res => {
        console.log(res);
        this.handleRequestOpen(`Merited all pledges: ${amount} merits`);

        this.setState({
          openMerit: false,
          description: '',
          amount: ''
        });
      })
      .catch((error) => {
        let pledge = error.response.data;

        console.log('Not enough merits for ', pledge);

        this.setState({
          open: true,
          message: `Not enough merits for ${pledge}.`
        });
      });
    }
  }

  demeritAll = () => {
    let token = this.props.state.token;
    let activeName = this.props.state.name;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let descriptionValidation = true;
    let amountValidation = true;

    if (!description || !amount || amount < 0) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount || amount < 0) {
        amountValidation = false;
      }

      this.setState({
        descriptionValidation: descriptionValidation,
        amountValidation: amountValidation,
      });
    }
    else {
      API.meritAll(token, activeName, description, -amount, photoURL)
      .then(res => {
        console.log(res);
        this.handleRequestOpen(`Demerited all pledges: ${amount} merits`);

        this.setState({
          openMerit: false,
          description: '',
          amount: ''
        });
      })
      .catch((error) => {
        let pledge = error.response.data;

        console.log('Not enough merits for', pledge);

        this.setState({
          open: true,
          message: `Not enough merits for ${pledge}.`
        });
      });
    }
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
            description={this.state.description}
            amount={this.state.amount}
            descriptionValidation={this.state.descriptionValidation}
            amountValidation={this.state.amountValidation}
            meritAll={this.meritAll}
            demeritAll={this.demeritAll}
            handleClose={this.handleMeritClose}
            handleChange={this.handleMeritChange}
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