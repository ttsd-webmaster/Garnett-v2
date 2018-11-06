import '../MyMerits/MyMerits.css';

import API from 'api/API.js';
import {
  loadFirebase,
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader } from 'components';
import { PledgeList, Filter, LoadablePledgeInfoDialog } from './components';

import React, { PureComponent } from 'react';

export class Pledges extends PureComponent {
  state = {
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
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleClose);
    this.setState({
      pledge,
      open: true
    });
  }

  handleClose = () => {
    androidBackClose();
    this.setState({ open: false }, () => {
      iosFullscreenDialogClose();
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
    let { pledges, reverse, loaded } = this.state;

    if (reverse) {
      pledges = pledges.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    if (!loaded) {
      return <LoadingComponent />
    }

    return (
      <div
        id="pledges-container"
        className={`animate-in${this.props.hidden ? " hidden" : ""}`}
      >
        <FilterHeader
          title="Pledges"
          toggleIcon={toggleIcon}
          state={this.props.state}
          filterName={this.state.filterName}
          openPopover={this.openPopover}
          reverse={this.reverse}
        />
        <PledgeList
          pledges={pledges}
          handleOpen={this.handleOpen}
        />
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
      </div>
    )
  }
}
