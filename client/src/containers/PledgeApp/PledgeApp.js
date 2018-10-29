import './PledgeApp.css';
import { getTabStyle } from 'helpers/functions';
import { LoadingPledgeApp } from 'helpers/loaders';
import {
  LoadableMeritBook,
  LoadableContacts,
  LoadableChalkboards,
  LoadableComplaints,
  LoadableSettings
} from 'helpers/LoadableComponents';

import React, { PureComponent } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

let didScroll = false;
let previousScrollTop = 0;

function watchScroll() {
  didScroll = true;
}

export default class PledgeApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Merit Book',
      slideIndex: 0,
      scrollPosition1: 0,
      scrollPosition2: 0,
      scrollPosition3: 0,
      scrollPosition4: 0,
      scrollPosition5: 0,
      loaded: false,
      activeArray: [],
      pledgeArray: [],
      meritArray: [],
      pledgeComplaints: [],
      activeComplaints: [],
      pendingComplaints: [],
      approvedComplaints: [],
      myHostingChalkboards: [],
      myAttendingChalkboards: [],
      myCompletedChalkboards: [],
      upcomingChalkboards: [],
      completedChalkboards: []
    };
  }

  componentDidMount() {
    const data = JSON.parse(localStorage.getItem('data'));
    let contentContainer = document.querySelector('.content-container');

    console.log(`Pledge app mount: ${this.props.state.name}`)
    localStorage.setItem('route', 'pledge-app');

    if (contentContainer) {
      if (/android/i.test(navigator.userAgent)) {
        contentContainer.firstChild.onscroll = watchScroll;
        contentContainer.classList.add('android');
      }
    }

    if (navigator.onLine) {
      this.setState({ loaded: true });
    }
    else {
      const activeArray = JSON.parse(localStorage.getItem('activeArray'));
      const myAttendingChalkboards = JSON.parse(localStorage.getItem('myAttendingChalkboards'));
      const myCompletedChalkboards = JSON.parse(localStorage.getItem('myCompletedChalkboards'));
      const upcomingChalkboards = JSON.parse(localStorage.getItem('upcomingChalkboards'));
      const completedChalkboards = JSON.parse(localStorage.getItem('completedChalkboards'));

      if (data.status !== 'pledge') {
        const pledgeArray = JSON.parse(localStorage.getItem('pledgeArray'));
        const myHostingChalkboards = JSON.parse(localStorage.getItem('myHostingChalkboards'));
        const activeComplaints = JSON.parse(localStorage.getItem('activeComplaints'));
        const pendingComplaints = JSON.parse(localStorage.getItem('pendingComplaints'));
        const approvedComplaints = JSON.parse(localStorage.getItem('approvedComplaints'));

        this.setState({
          loaded: true,
          pledgeArray: pledgeArray,
          activeArray: activeArray,
          activeComplaints: activeComplaints,
          pendingComplaints: pendingComplaints,
          approvedComplaints: approvedComplaints,
          myHostingChalkboards: myHostingChalkboards,
          myAttendingChalkboards: myAttendingChalkboards,
          myCompletedChalkboards: myCompletedChalkboards,
          upcomingChalkboards: upcomingChalkboards,
          completedChalkboards: completedChalkboards
        });
      }
      else {
        const meritArray = JSON.parse(localStorage.getItem('meritArray'));
        const pledgeComplaints = JSON.parse(localStorage.getItem('pledgeComplaints'));
        const totalMerits = localStorage.getItem('totalMerits');

        this.setState({
          loaded: true,
          meritArray: meritArray,
          totalMerits: totalMerits,
          pledgeComplaints: pledgeComplaints,
          activeArray: activeArray,
          myAttendingChalkboards: myAttendingChalkboards,
          myCompletedChalkboards: myCompletedChalkboards,
          upcomingChalkboards: upcomingChalkboards,
          completedChalkboards: completedChalkboards
        });
      }
    }

    // Checks if page has scrolled
    this.interval = setInterval(() => {
      if (/android/i.test(navigator.userAgent)) {
        if (didScroll) {
          didScroll = false;
          this.onScroll();
        }
      }
    }, 100);
  }

  componentDidUpdate() {
    const index = this.state.slideIndex;
    let contentContainer = document.querySelector('.content-container');

    // Changes view margin if view is pledge merit book
    if (contentContainer) {
      if (/android/i.test(navigator.userAgent)) {
        contentContainer.childNodes[index].onscroll = watchScroll;
        contentContainer.classList.add('android');
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onScroll = () => {
    const tabs = document.getElementById('pledge-app-tabs').firstChild;
    const inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
    const appBar = document.querySelector('.app-header');
    const contentContainer = document.querySelector('.content-container');
    const { slideIndex } = this.state;
    const view = contentContainer.childNodes[slideIndex];
    const { body } = document;
    const { scrollTop } = view;
    
    // Hides and shows the app bar and the necessary components on scroll
    if (scrollTop > previousScrollTop) {
      // Scroll Down
      tabs.classList.add('hide-tabs');
      appBar.classList.add('hide-app-bar');
      view.classList.add('hide-content-container');
      inkBar.classList.add('hide-content-container');
      body.classList.add('hide-buttons');
    }
    else {
      // Scroll Up
      tabs.classList.remove('hide-tabs');
      appBar.classList.remove('hide-app-bar');
      view.classList.remove('hide-content-container');
      inkBar.classList.remove('hide-content-container');
      body.classList.remove('hide-buttons');
    }
    
    previousScrollTop = scrollTop;
  }

  handleChange = (index) => {
    let title;
    let { slideIndex,
          scrollPosition1,
          scrollPosition2,
          scrollPosition3,
          scrollPosition4,
          scrollPosition5 } = this.state;
    const tabs = document.getElementById('pledge-app-tabs').firstChild;
    const inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
    const appBar = document.querySelector('.app-header');
    const contentContainer = document.querySelector('.content-container');
    let view = contentContainer.childNodes[index];
    const { body } = document;
    const scrollPosition = contentContainer.childNodes[slideIndex].scrollTop;;
    let scrolled;

    // Hides and shows the app bar if scrolled for that view for mobile
    if (/android/i.test(navigator.userAgent)) {
      tabs.classList.remove('hide-tabs');
      appBar.classList.remove('hide-app-bar');
      view.classList.remove('hide-content-container');
      inkBar.classList.remove('hide-content-container');
      body.classList.remove('hide-buttons');
    }

    // Sets the title and marks scroll position based on the tab index
    if (index === 0) {
      title = 'Merit Book';
      scrolled = scrollPosition1;
    }
    else if (index === 1) {
      title = 'Contacts';
      scrolled = scrollPosition2;
    }
    else if (index === 2) {
      title = 'Chalkboards';
      scrolled = scrollPosition3;
    }
    else if (index === 3) {
      title = 'Complaints';
      scrolled = scrollPosition4;
    }
    else {
      title = 'Settings';
      scrolled = scrollPosition5;
    }

    // Updates the previous scroll position based on the previous index
    if (slideIndex === 0) {
      scrollPosition1 = scrollPosition;
    }
    else if (slideIndex === 1) {
      scrollPosition2 = scrollPosition;
    }
    else if (slideIndex === 2) {
      scrollPosition3 = scrollPosition;
    }
    else if (slideIndex === 3) {
      scrollPosition4 = scrollPosition;
    }
    else {
      scrollPosition5 = scrollPosition;
    }

    // Sets the view scroll position based on tab
    view.scrollTop = scrolled;

    this.setState({
      title,
      scrollPosition1,
      scrollPosition2,
      scrollPosition3,
      scrollPosition4,
      scrollPosition5,
      slideIndex: index
    });
  };

  render() {
    return (
      this.state.loaded ? (
        <div>
          <div className="app-header">
            <span> {this.state.title} </span>
          </div>
          
          <Tabs
            id="pledge-app-tabs"
            contentContainerClassName="content-container"
            value={this.state.slideIndex}
            onChange={this.handleChange}
          >
            <Tab 
              icon={<i style={getTabStyle(this.state.slideIndex === 0)} className="icon-star"></i>}
              value={0}
            >
              <LoadableMeritBook 
                state={this.props.state}
                index={this.state.slideIndex}
                pledgeArray={this.state.pledgeArray}
                meritArray={this.state.meritArray}
                totalMerits={this.state.totalMerits}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i style={getTabStyle(this.state.slideIndex === 1)} className="icon-address-book"></i>}
              value={1}
            >
              <LoadableContacts
                state={this.props.state}
                actives={this.state.activeArray}
              />
            </Tab>
            <Tab
              icon={<i style={getTabStyle(this.state.slideIndex === 2)} className="icon-calendar-empty"></i>}
              value={2}
            >
              <LoadableChalkboards 
                state={this.props.state}
                index={this.state.slideIndex}
                myHostingChalkboards={this.state.myHostingChalkboards}
                myAttendingChalkboards={this.state.myAttendingChalkboards}
                myCompletedChalkboards={this.state.myCompletedChalkboards}
                upcomingChalkboards={this.state.upcomingChalkboards}
                completedChalkboards={this.state.completedChalkboards}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i style={getTabStyle(this.state.slideIndex === 3)} className="icon-thumbs-down-alt"></i>}
              value={3}
            >
              <LoadableComplaints
                state={this.props.state}
                index={this.state.slideIndex}
                pledgeComplaints={this.state.pledgeComplaints}
                activeComplaints={this.state.activeComplaints}
                pendingComplaints={this.state.pendingComplaints}
                approvedComplaints={this.state.approvedComplaints}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i style={getTabStyle(this.state.slideIndex === 4)} className="icon-cog"></i>}
              value={4}
            >
              <LoadableSettings 
                state={this.props.state} 
                logoutCallBack={this.props.logoutCallBack} 
                history={this.props.history}
              />
            </Tab>
          </Tabs>
        </div>
      ) : (
        <LoadingPledgeApp />
      )
    )
  }
}