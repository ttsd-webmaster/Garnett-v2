import {
  loadFirebase,
  isMobileDevice,
  showHeader,
  hideHeader,
  androidBackOpen,
  androidBackClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { Filter } from './components/Filter.js';

import React, { Component } from 'react';
import { Portal } from 'react-portal';
import Loadable from 'react-loadable';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

const LoadableActiveMeritDialog = Loadable({
  loader: () => import('./components/Dialogs/ActiveMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

const LoadablePledgeInfoDialog = Loadable({
  loader: () => import('./components/Dialogs/PledgeInfoDialog/PledgeInfoDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export default class ActiveMerit extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      pledges: this.props.pledges,
      pledge: null,
      filter: 'lastName',
      filterName: 'Last Name',
      reverse: false,
      open: false,
      openMerit: false,
      openPopover: false
    };
  }

  componentDidMount () {
   this._isMounted = true

   if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let pledges = [];
        const firebase = window.firebase;
        const dbRef = firebase.database().ref('/users');

        dbRef.on('value', (snapshot) => {
          const { filter } = this.state;

          pledges = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          }).filter((child) => {
            return child.status === 'pledge';
          });

          if (this.state.filterName === 'Total Merits') {
            pledges = pledges.sort(function(a, b) {
              return a[filter] < b[filter] ? 1 : -1;
            });
          }
          else {
            pledges = pledges.sort(function(a, b) {
              return a[filter] > b[filter] ? 1 : -1;
            });
          }

          localStorage.setItem('pledgeArray', JSON.stringify(pledges));
          
          if (this._isMounted) {
            this.setState({
              loaded: true,
              pledges: pledges
            });
          }
        });
      });
    }
    else {
      if (this._isMounted) {
        this.setState({
          loaded: true
        });
      }
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentDidUpdate() {
    const meritButton = document.querySelector('.fixed-button.active-merit');

    if (meritButton) {
      if (this.props.index === 0) {
        meritButton.classList.remove('hidden');
      }
      else {
        meritButton.classList.add('hidden');
      }
    }
  }

  handleOpen = (pledge) => {
    if (isMobileDevice()) {
      const meritButton = document.querySelector('.fixed-button.active-merit');
      meritButton.style.display = 'none';
      hideHeader(0);
      androidBackOpen(this.handleClose);
    }

    this.setState({
      pledge,
      open: true
    });
  }

  handleClose = () => {
    if (isMobileDevice()) {
      const meritButton = document.querySelector('.fixed-button.active-merit');
      meritButton.style.display = 'inline-block';
      showHeader(0);
      androidBackClose();
    }

    this.setState({ open: false });
  }

  handleMeritOpen = () => {
    if (navigator.onLine) {
      androidBackOpen(this.handleMeritClose);
      this.setState({ openMerit: true });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    androidBackClose();
    this.setState({
      openMerit: false
    });
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
    this.setState({
      openPopover: false,
    });
  };

  setFilter = (filterName) => {
    let filter = filterName.replace(/ /g,'');
    filter = filter[0].toLowerCase() + filter.substr(1);
    let pledges = this.state.pledges.sort(function(a, b) {
      return a[filter] > b[filter] ? 1 : -1;
    });

    if (filterName === 'Total Merits') {
      pledges = this.state.pledges.sort(function(a, b) {
        return a[filter] < b[filter] ? 1 : -1;
      });
    }

    this.setState({
      pledges,
      filter,
      filterName,
      reverse: false,
      openPopover: false
    });
  }

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    let toggleIcon = "icon-down-open-mini";
    let { pledges, reverse } = this.state;

    if (reverse) {
      pledges = pledges.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    return (
      this.state.loaded ? (
        <div className="animate-in">
          <Subheader className="garnett-subheader">
            Pledges
            <span style={{float:'right'}}>
              <span className="garnett-filter" onClick={this.openPopover}> 
                {this.state.filterName}
              </span>
              <IconButton
                iconClassName={toggleIcon}
                className="reverse-toggle"
                onClick={this.reverse}
              />
            </span>
          </Subheader>

          <List className="garnett-list">
            {pledges.map((pledge, i) => (
              <div key={i}>
                <Divider className="garnett-divider large" inset={true} />
                <ListItem
                  className="garnett-list-item large"
                  leftAvatar={<Avatar className="garnett-image large" size={70} src={pledge.photoURL} />}
                  primaryText={
                    <p className="garnett-name"> {pledge.firstName} {pledge.lastName} </p>
                  }
                  secondaryText={
                    <p>
                      {pledge.year}
                      <br />
                      {pledge.major}
                    </p>
                  }
                  secondaryTextLines={2}
                  onClick={() => this.handleOpen(pledge)}
                >
                  <p className="pledge-merits"> {pledge.totalMerits} </p>
                </ListItem>
                <Divider className="garnett-divider large" inset={true} />
              </div>
            ))}
          </List>

          <Portal>
            <FloatingActionButton className="fixed-button active-merit" onClick={this.handleMeritOpen}>
              <i className="icon-pencil"></i>
            </FloatingActionButton>
          </Portal>

          <Filter
            open={this.state.openPopover}
            anchorEl={this.state.anchorEl}
            filterName={this.state.filterName}
            closePopover={this.closePopover}
            setFilter={this.setFilter}
          />
          
          <LoadableActiveMeritDialog
            open={this.state.openMerit}
            state={this.props.state}
            handleMeritClose={this.handleMeritClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
          
          <LoadablePledgeInfoDialog
            open={this.state.open}
            state={this.props.state}
            pledge={this.state.pledge}
            handleClose={this.handleClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
