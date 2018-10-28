import 'containers/PledgeApp/components/MeritBook/MeritBook.css';
import API from 'api/API.js';
import { loadFirebase } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { Filter } from './components/Filter.js';
import { LoadablePledgeInfoDialog } from './components/Dialogs';

import React, { Component, Fragment } from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export class Pledges extends Component {
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

  componentDidMount() {
    if (navigator.onLine) {
      if (this.props.state.status === 'pledge') {
        API.getPbros()
        .then(res => {
          localStorage.setItem('pbros', JSON.stringify(res.data));

          this.setState({
            loaded: true,
            pledges: res.data
          });
        })
        .catch(error => console.log(`Error: ${error}`));
      }
      else {
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
            
            this.setState({
              loaded: true,
              pledges: pledges
            });
          });
        });
      }
    }
    else {
      this.setState({
        loaded: true
      })
    }
  }

  handleOpen = (pledge) => {
    this.setState({
      pledge,
      open: true
    });

    // Handles android back button
    if (/android/i.test(navigator.userAgent)) {
      let path = 'https://garnett-app.herokuapp.com';

      if (process.env.NODE_ENV === 'development') {
        path = 'http://localhost:3000';
      }

      window.history.pushState(null, null, path + window.location.pathname);
      window.onpopstate = () => {
        this.handleClose();
      }
    }
  }

  handleClose = () => {
    // Handles android back button
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({
      open: false
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
        <Fragment>
          <Subheader className="garnett-subheader">
            {this.props.state.status === 'pledge' ? (
              <Fragment>Pledge Brothers</Fragment>
            ) : (
              <Fragment>
                <Fragment>Pledges</Fragment>
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
              </Fragment>
            )}
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
          
          <LoadablePledgeInfoDialog
            open={this.state.open}
            state={this.props.state}
            pledge={this.state.pledge}
            handleClose={this.handleClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />

          {this.props.state.status !== 'pledge' && (
            <Filter
              open={this.state.openPopover}
              anchorEl={this.state.anchorEl}
              filterName={this.state.filterName}
              closePopover={this.closePopover}
              setFilter={this.setFilter}
            />
          )}
        </Fragment>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
