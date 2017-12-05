import './PledgeApp.css';
import API from '../../api/API.js';
import {loadFirebase} from '../../helpers/functions.js';
import {LoadingPledgeApp} from '../../helpers/loaders.js';
import MeritBook from '../../components/MeritBook/MeritBook';
import Contacts from '../../components/Contacts/Contacts';
import Complaints from '../../components/Complaints/Complaints';
import Settings from '../../components/Settings/Settings';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';

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

let didScroll = false;

function watchScroll() {
  didScroll = true;
}

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
      totalMerits: null,
      activeArray: [],
      pledgeArray: [],
      meritArray: [],
      complaintsArray: [],
      pledgeComplaintsArray: [],
      activeComplaintsArray: []
    };
  }

  componentDidMount() {
    console.log('Pledge app mount: ', this.props.state.name)

    let data = localStorage.getItem('data');
    let firebaseData = JSON.parse(localStorage.getItem('firebaseData'));
    let firebase = window.firebase;

    if (navigator.onLine) {
      if (!this.props.state.name) {
        if (data !== null) {
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
      if (data !== null) {
        if (data.data.user.status === 'active') {
          let pledgeArray = JSON.parse(localStorage.getItem('pledgeArray'));
          let activeArray = JSON.parse(localStorage.getItem('activeArray'));
          let pledgeComplaintsArray = JSON.parse(localStorage.getItem('pledgeComplaintsArray'));
          let activeComplaintsArray = JSON.parse(localStorage.getItem('activeComplaintsArray'));

          this.setState({
            loaded: true,
            pledgeArray: pledgeArray,
            activeArray: activeArray,
            pledgeComplaintsArray: pledgeComplaintsArray,
            activeComplaintsArray: activeComplaintsArray
          });
        }
        else {
          let totalMerits = localStorage.getItem('totalMerits');
          let meritArray = JSON.parse(localStorage.getItem('meritArray'));
          let complaintsArray = JSON.parse(localStorage.getItem('complaintsArray'));
          let activeArray = JSON.parse(localStorage.getItem('activeArray'));

          this.setState({
            loaded: true,
            totalMerits: totalMerits,
            meritArray: meritArray,
            complaintsArray: complaintsArray,
            activeArray: activeArray
          });
        }
      }
      else {
        this.props.history.push('/');
      }
    }

    setInterval(() => {
      if (didScroll) {
        didScroll = false;
        this.onScroll();
      }
    }, 100);

    window.PullToRefresh.init({
      mainElement: 'body',
      onRefresh: () => {
        if (navigator.onLine) {
          if (this.props.state.status === 'active') {
            API.getPledges()
            .then(res => {
              this.setState({
                pledgeArray: res.data
              });
            })
            .catch(err => console.log(err));
          }
          else {
            let displayName = this.props.state.displayName;

            API.getPledgeData(displayName)
            .then(res => {
              this.setState({
                totalMerits: res.data.totalMerits,
                meritArray: res.data.meritArray,
                complaintsArray: res.data.complaintsArray
              });
            })
            .catch(err => console.log(err)); 
          }
        }
      },
      shouldPullToRefresh: () => {
        let contentContainer = document.querySelector('.content-container');
        let index = this.state.slideIndex;

        return contentContainer.childNodes[index].scrollTop === 0;
      }
    });
  }

  // Changes view margin if view is pledge merit book
  componentDidUpdate() {
    let index = this.state.slideIndex;
    let pullToRefresh = document.querySelector('.ptr--ptr');
    let contentContainer = document.querySelector('.content-container');
    let complaintsTabs = document.getElementById('complaints-tabs');
    
    if (pullToRefresh) {
      pullToRefresh.style.marginTop = '100px';
    }

    // Changes view margin if view is pledge merit book
    if (contentContainer) {
      contentContainer.childNodes[index].onscroll = watchScroll;

      contentContainer.childNodes[index].style.position = 'fixed';
      contentContainer.childNodes[index].style.height = 'calc(100% - 100px)';

      for (let i = 0; i < 4; i++) {
        if (index !== i) {
          contentContainer.childNodes[i].style.position = 'relative';
          contentContainer.childNodes[i].style.height = 0;
          contentContainer.childNodes[i].style.marginBottom = 0;
        }
      }

      if (this.props.state.status === 'pledge' && index === 0) {
        contentContainer.childNodes[index].style.marginBottom = '50px';
        contentContainer.childNodes[index].style.height = 'calc(100% - 150px)';
      }

      if (this.props.state.status !== 'pledge' && index === 2) {
        contentContainer.childNodes[index].style.height = 'calc(100vh - 157px)';
      }
    }

    if (complaintsTabs) {
      if (this.props.state.status === 'active' && this.state.slideIndex === 2) {
        complaintsTabs.style.display = 'flex';
      }
      else {
        complaintsTabs.style.display = 'none';
      }
    }
  }

  getData = (user, firebase) => {
    if (user.status === 'active') {
      this.setState({
        loaded: true
      });
    }
    else {
      loadFirebase('database')
      .then(() => {
        let fullName = user.firstName + user.lastName;
        let userRef = firebase.database().ref('/users/' + fullName);
        let totalMerits;

        userRef.on('value', (snapshot) => {
          totalMerits = snapshot.val().totalMerits;

          localStorage.setItem('totalMerits', snapshot.val().totalMerits);

          this.setState({
            loaded: true,
            totalMerits: totalMerits,
          });
        });
      });
    }
  }

  onScroll = () => {
    let contentContainer = document.querySelector('.content-container');
    let index = this.state.slideIndex;
    let view = contentContainer.childNodes[index];

    if (view) {
      if (view.scrollTop >= 1) {
        view.style.touchAction = 'auto';
      } 
      else {
        view.style.touchAction = 'pan-down';
      }
    }
  }

  handleChange = (value) => {
    let title;
    let previousIndex = this.state.previousIndex;
    let scrollPosition1 = this.state.scrollPosition1;
    let scrollPosition2 = this.state.scrollPosition2;
    let scrollPosition3 = this.state.scrollPosition3;
    let scrollPosition4 = this.state.scrollPosition4;
    let contentContainer = document.querySelector('.content-container');
    let scrollPosition = contentContainer.childNodes[previousIndex].scrollTop;
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
      title = 'Account';
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

    if (contentContainer) {
      contentContainer.childNodes[value].style.position = 'fixed';
      contentContainer.childNodes[value].style.height = 'calc(100% - 100px)';

      for (let i = 0; i < 4; i++) {
        if (value !== i) {
          contentContainer.childNodes[i].style.position = 'relative';
          contentContainer.childNodes[i].style.height = 0;
          contentContainer.childNodes[i].style.marginBottom = 0;
        }
      }

      if (this.props.state.status === 'pledge' && value === 0) {
        contentContainer.childNodes[value].style.marginBottom = '50px';
        contentContainer.childNodes[value].style.height = 'calc(100% - 150px)';
      }
    }

    // Sets the window scroll position based on tab
    contentContainer.childNodes[value].scrollTop = scrolled;

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
    if (navigator.onLine) {
      this.setState({
        openMerit: true
      });
    }
    else {
      this.handleRequestOpen('You are offline.');
    }
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
            contentContainerClassName="content-container"
            inkBarStyle={inkBarStyle}
            tabItemContainerStyle={tabContainerStyle}
            onChange={this.handleChange}
            value={this.state.slideIndex}
          >
            <Tab 
              icon={<i className="icon-star"></i>}
              value={0}
            >
              <MeritBook 
                state={this.props.state} 
                pledgeArray={this.state.pledgeArray}
                meritArray={this.state.meritArray}
                handleRequestOpen={this.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i className="icon-address-book"></i>}
              value={1}
            >
              <Contacts
                state={this.props.state}
                activeArray={this.state.activeArray}
              />
            </Tab>
            <Tab
              icon={<i className="icon-thumbs-down-alt"></i>}
              value={2}
            >
              <Complaints
                state={this.props.state}
                pledgeComplaintsArray={this.state.pledgeComplaintsArray}
                activeComplaintsArray={this.state.activeComplaintsArray}
                complaintsArray={this.state.complaintsArray}
                handleRequestOpen={this.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i className="icon-sliders"></i>}
              value={3} 
            >
              <Settings 
                state={this.props.state} 
                logoutCallBack={this.props.logoutCallBack} 
                history={this.props.history}
              />
            </Tab>
          </Tabs>

          {this.state.slideIndex === 0 && (
            this.props.state.status === 'pledge' ? (
              <div className="total-merits"> 
                Total Merits: {this.state.totalMerits} 
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
        <LoadingPledgeApp />
      )
    )
  }
}