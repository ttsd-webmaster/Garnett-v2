import './Chalkboards.css';
import MyChalkboards from './components/MyChalkboards';
import AllChalkboards from './components/AllChalkboards';
import {
  isMobile,
  getToday,
  androidBackOpen,
  androidBackClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import {
  LoadableAddChalkboardDialog,
  LoadableHandleChalkboardDialog,
} from './components/Dialogs'; 

import React, { Component } from 'react';
import { Portal} from 'react-portal';
import { forceCheck } from 'react-lazyload';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

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
      myHostingChalkboards: [],
      myAttendingChalkboards: [],
      myCompletedChalkboards: [],
      upcomingChalkboards: [],
      completedChalkboards: [],
      selectedChalkboard: null,
      chalkboardType: '',
      openPopover: false,
      filter: 'date',
      filterName: 'Date',
      reverse: false
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
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
          const today = getToday();

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
    }
    else {
      const upcomingChalkboards = localStorage.getItem('upcomingChalkboards');
      const completedChalkboards = localStorage.getItem('completedChalkboards');
      const myHostingChalkboards = localStorage.getItem('myHostingChalkboards');
      const myAttendingChalkboards = localStorage.getItem('myAttendingChalkboards');
      const myCompletedChalkboards = localStorage.getItem('myCompletedChalkboards');
      this.setState({
        loaded: true,
        upcomingChalkboards,
        completedChalkboards,
        myHostingChalkboards,
        myAttendingChalkboards,
        myCompletedChalkboards
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
    let contentContainer = document.getElementById('content-container');
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
      if (isMobile()) {
        androidBackOpen(this.addClose);
      }

      this.setState({ openAdd: true });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  addClose = () => {
    if (isMobile()) {
      androidBackClose();
    }

    this.setState({ openAdd: false });
  }

  handleOpen = (chalkboard, type) => {
    if (isMobile()) {
      androidBackOpen(this.handleClose);
    }

    this.setState({
      open: true,
      selectedChalkboard: chalkboard,
      chalkboardType: type
    });
  }

  handleClose = () => {
    if (isMobile()) {
      androidBackClose();
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
    let filter = filterName.replace(/ /g, '');
    // Convert first letter of filter to be lower cased
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
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingComponent />
    }
    
    return (
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
    )
  }
}
