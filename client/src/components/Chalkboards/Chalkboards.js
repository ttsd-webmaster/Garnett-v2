import './Chalkboards.css';
import MyChalkboards from './Views/MyChalkboards';
import AllChalkboards from './Views/AllChalkboards';
import {loadFirebase, isMobileDevice, getDate} from 'helpers/functions.js';
import {LoadingComponent} from 'helpers/loaders.js';

import React, {Component} from 'react';
import {Portal} from 'react-portal';
import {forceCheck} from 'react-lazyload';
import Loadable from 'react-loadable';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const LoadableAddChalkboardDialog = Loadable({
  loader: () => import('./Dialogs/AddChalkboardDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

const LoadableHandleChalkboardDialog = Loadable({
  loader: () => import('./Dialogs/HandleChalkboardDialog'),
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
      openPopover: false,
      filter: 'date',
      filterName: 'Date',
      reverse: false
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const chalkboardsRef = firebase.database().ref('/chalkboards');
        let chalkboards = [];

        chalkboardsRef.on('value', (snap) => {
          let myHostingChalkboards = [];
          let myAttendingChalkboards = [];
          let myCompletedChalkboards = [];
          let upcomingChalkboards = [];
          let completedChalkboards = [];
          
          // Checks if there are any chalkboards
          if (snap.val()) {
            const today = getDate();

            // Converts object to array
            chalkboards = Object.keys(snap.val()).map(function(key) {
              return snap.val()[key];
            });

            // Checks which chalkboards I am attending and which ones I have completed
            chalkboards.forEach((chalkboard) => {
              // Checks if the user has created the chalkboard
              if (this.props.state.status !== 'pledge' &&
                  this.props.state.name === chalkboard.activeName) {
                if (chalkboard.date >= today) {
                  myHostingChalkboards.push(chalkboard);
                }
                else {
                  myCompletedChalkboards.push(chalkboard);
                }
              }
              else {
                let isAttendee = false;
                
                if (chalkboard.attendees) {
                  let attendees = Object.keys(chalkboard.attendees).map(function(key) {
                    return chalkboard.attendees[key];
                  });
                  attendees.forEach((attendee) => {
                    if (this.props.state.name === attendee.name) {
                      isAttendee = true;
                    }
                  });
                }

                // Checks if the user is attending the chalkboard
                if (isAttendee) {
                  if (chalkboard.date >= today) {
                    myAttendingChalkboards.push(chalkboard);
                  }
                  else {
                    myCompletedChalkboards.push(chalkboard);
                  }
                }
                // All chalkboards the user did not create or is not attending
                else {
                  if (chalkboard.date >= today) {
                    upcomingChalkboards.push(chalkboard);
                  }
                  else {
                    completedChalkboards.push(chalkboard);
                  }
                }
              }
            });
          }

          console.log(`My Hosting Chalkboards: ${myHostingChalkboards}`);
          console.log(`My Attending Chalkboards: ${myAttendingChalkboards}`);
          console.log(`My Completed Chalkboards: ${myCompletedChalkboards}`);
          console.log(`Upcoming Chalkboards: ${upcomingChalkboards}`);
          console.log(`Completed Upcoming Chalkboards: ${completedChalkboards}`);

          localStorage.setItem('upcomingChalkboards', JSON.stringify(upcomingChalkboards));
          localStorage.setItem('completedChalkboards', JSON.stringify(completedChalkboards));
          localStorage.setItem('myHostingChalkboards', JSON.stringify(myHostingChalkboards));
          localStorage.setItem('myAttendingChalkboards', JSON.stringify(myAttendingChalkboards));
          localStorage.setItem('myCompletedChalkboards', JSON.stringify(myCompletedChalkboards));

          this.setState({
            loaded: true,
            upcomingChalkboards,
            completedChalkboards,
            myHostingChalkboards,
            myAttendingChalkboards,
            myCompletedChalkboards
          });
        });
      });
    }
    else {
      this.setState({ loaded: true });
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
          addChalkboard.parentNode.classList.remove('hidden');
        }
      }
      else {
        chalkboardsTabs.style.display = 'none';
        if (this.props.state.status !== 'pledge') {
          addChalkboard.parentNode.classList.add('hidden');
        }
      }
    }
  }

  select = (index) => {
    let previousIndex = this.state.selectedIndex;
    let { scrollPosition1, scrollPosition2 } = this.state;
    let contentContainer = document.querySelector('.content-container');
    const scrollPosition = contentContainer.childNodes[2].scrollTop;
    const myChalkboards = document.getElementById('my-chalkboards');
    const allChalkboards = document.getElementById('all-chalkboards');
    let scrolled;

    if (previousIndex !== index) {
      myChalkboards.classList.toggle('active');
      allChalkboards.classList.toggle('active');

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

      forceCheck();

      this.setState({
        selectedIndex: index,
        scrollPosition1,
        scrollPosition2
      });
    }
  }

  addOpen = () => {
    if (navigator.onLine) {
      if (isMobileDevice()) {
        const contentContainer = document.querySelector('.content-container').childNodes[2];
        let tabs = document.getElementById('pledge-app-tabs').firstChild;
        let inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
        let appBar = document.querySelector('.app-header');

        contentContainer.style.setProperty('overflow', 'visible', 'important');

        tabs.style.zIndex = 0;
        inkBar.style.zIndex = 0;
        appBar.style.zIndex = 0;
      }

      this.setState({ openAdd: true });

      // Handles android back button
      if (/android/i.test(navigator.userAgent)) {
        let path;
        if (process.env.NODE_ENV === 'development') {
          path = 'http://localhost:3000';
        }
        else {
          path = 'https://garnett-app.herokuapp.com';
        }

        window.history.pushState(null, null, path + window.location.pathname);
        window.onpopstate = () => {
          this.addClose();
        }
      }
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  addClose = () => {
    if (isMobileDevice()) {
      const contentContainer = document.querySelector('.content-container').childNodes[2];
      let tabs = document.getElementById('pledge-app-tabs').firstChild;
      let inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
      let appBar = document.querySelector('.app-header');

      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        contentContainer.style.setProperty('overflow', 'scroll', 'important');
      }
      else {
        contentContainer.style.setProperty('overflow', 'auto', 'important');
      }

      tabs.style.zIndex = 1;
      inkBar.style.zIndex = 1;
      appBar.style.zIndex = 1;
    }
    
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({ openAdd: false });
  }

  handleOpen = (chalkboard, type) => {
    if (isMobileDevice()) {
      let contentContainer = document.querySelector('.content-container').childNodes[2];
      let tabs = document.getElementById('pledge-app-tabs').firstChild;
      let inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
      let appBar = document.querySelector('.app-header');

      contentContainer.style.setProperty('overflow', 'visible', 'important');
      contentContainer.style.WebkitOverflowScrolling = 'auto';
      
      tabs.style.zIndex = 0;
      inkBar.style.zIndex = 0;
      appBar.style.zIndex = 0;
    }

    this.setState({
      open: true,
      selectedChalkboard: chalkboard,
      chalkboardType: type
    });

    // Handles android back button
    if (/android/i.test(navigator.userAgent)) {
      let path;
      if (process.env.NODE_ENV === 'development') {
        path = 'http://localhost:3000';
      }
      else {
        path = 'https://garnett-app.herokuapp.com';
      }

      window.history.pushState(null, null, path + window.location.pathname);
      window.onpopstate = () => {
        this.handleClose();
      }
    }
  }

  handleClose = () => {
    if (isMobileDevice()) {
      let contentContainer = document.querySelector('.content-container').childNodes[2];
      let tabs = document.getElementById('pledge-app-tabs').firstChild;
      let inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
      let appBar = document.querySelector('.app-header');

      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        contentContainer.style.setProperty('overflow', 'scroll', 'important');
        contentContainer.style.WebkitOverflowScrolling = 'touch';
      }
      else {
        contentContainer.style.setProperty('overflow', 'auto', 'important');
      }
      
      tabs.style.zIndex = 1;
      inkBar.style.zIndex = 1;
      appBar.style.zIndex = 1;
    }

    // Handles android back button
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({ open: false });
  }

  openPopover = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      openPopover: true,
      anchorEl: event.currentTarget,
    });
  };

  closePopover = () => {
    this.setState({ openPopover: false });
  };

  setFilter = (filterName) => {
    let filter = filterName.replace(/ /g,'');
    filter = filter[0].toLowerCase() + filter.substr(1);

    this.setState({
      filter,
      filterName,
      reverse: false,
      openPopover: false
    });
  }

  filterCount(chalkboard, filter) {
    if (filter === 'timeCommitment') {
      return chalkboard[filter].value;
    }
    else if (filter === 'attendees') {
      if (chalkboard[filter] === undefined) {
        return 0;
      }
      else {
        return Object.keys(chalkboard[filter]).length;
      }
    }
    else {
      return chalkboard[filter];
    }
  }

  reverse = () => {
    let reverse = true;

    if (this.state.reverse) {
      reverse = false;
    }

    this.setState({ reverse });
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
            filter={this.state.filter}
            filterName={this.state.filterName}
            reverse={this.state.reverse}
            reverseChalkboards={this.reverse}
            setFilter={this.setFilter}
            filterCount={this.filterCount}
            openPopover={this.openPopover}
            handleOpen={this.handleOpen}
          />
          <AllChalkboards
            upcomingChalkboards={this.state.upcomingChalkboards}
            completedChalkboards={this.state.completedChalkboards}
            filter={this.state.filter}
            filterName={this.state.filterName}
            reverse={this.state.reverse}
            reverseChalkboards={this.reverse}
            setFilter={this.setFilter}
            filterCount={this.filterCount}
            openPopover={this.openPopover}
            handleOpen={this.handleOpen}
          />

          <Portal>
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
          </Portal>

          <Popover
            open={this.state.openPopover}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.closePopover}
            animation={PopoverAnimationVertical}
          >
            <Menu>
              <MenuItem
                primaryText="Date"
                insetChildren
                checked={this.state.filterName === 'Date'}
                onClick={() => this.setFilter('Date')}
              />
              <MenuItem
                primaryText="Amount"
                insetChildren
                checked={this.state.filterName === 'Amount'}
                onClick={() => this.setFilter('Amount')}
              />
              <MenuItem
                primaryText="Time Commitment"
                insetChildren
                checked={this.state.filterName === 'Time Commitment'}
                onClick={() => this.setFilter('Time Commitment')}
              />
              <MenuItem
                primaryText="Attendees"
                insetChildren
                checked={this.state.filterName === 'Attendees'}
                onClick={() => this.setFilter('Attendees')}
              />
            </Menu>
          </Popover>

          {this.props.state.status !== 'pledge' && (
            <Portal>
              <FloatingActionButton id="add-chalkboard" className="fixed-button hidden" onClick={this.addOpen}>
                <i className="icon-calendar-plus-o"></i>
              </FloatingActionButton>

              <LoadableAddChalkboardDialog
                open={this.state.openAdd}
                state={this.props.state}
                handleClose={this.addClose}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </Portal>
          )}

          <Portal>
            <LoadableHandleChalkboardDialog
              open={this.state.open}
              state={this.props.state}
              type={this.state.chalkboardType}
              chalkboard={this.state.selectedChalkboard}
              handleClose={this.handleClose}
              handleRequestOpen={this.props.handleRequestOpen}
            />
          </Portal>
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
