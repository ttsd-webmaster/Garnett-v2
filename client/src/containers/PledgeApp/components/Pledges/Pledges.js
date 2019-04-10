// @flow

import './Pledges.css';

import API from 'api/API.js';
import {
  loadFirebase,
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { Filter, FilterHeader, UserRow } from 'components';
import { LoadablePledgeInfoDialog } from './components/Dialogs';
import type { User } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import { List } from 'material-ui/List';

const filterOptions = [
  'Last Name',
  'First Name',
  'Year',
  'Major',
  'Total Merits'
];

type Props = {
  state: User,
  handleRequestOpen: () => void
};

type State = {
  loaded: boolean,
  pledges: ?Array<User>,
  pledge: ?User,
  filter: string,
  filterName: string,
  reverse: boolean,
  openPledge: boolean,
  openPopover: boolean,
  anchorEl: ?HTMLDivElement
};

export class Pledges extends PureComponent<Props, State> {
  state = {
    loaded: false,
    pledges: null,
    pledge: null,
    filter: 'lastName',
    filterName: 'Last Name',
    reverse: false,
    openPledge: false,
    openPopover: false,
    anchorEl: null
  };

  componentDidMount() {
    if (!navigator.onLine) {
      this.setState({ loaded: true });
      return
    }
    if (this.props.state.status === 'pledge') {
      API.getPbros(this.props.state.displayName)
      .then(res => {
        let pledges = res.data;
        const { filter } = this.state;
        // Sort the pledges based on the selected filter
        if (this.state.filterName === 'Total Merits') {
          pledges = pledges.sort(function(a, b) {
            return a[filter] < b[filter] ? 1 : -1;
          });
        } else {
          pledges = pledges.sort(function(a, b) {
            return a[filter] >= b[filter] ? 1 : -1;
          });
        }

        localStorage.setItem('pbros', JSON.stringify(pledges));
        this.setState({ pledges, loaded: true });
      })
      .catch(error => {
        console.error(`Error: ${error}`);
        this.setState({ loaded: true });
      });
    } else {
      loadFirebase('database')
      .then(() => {
        const firebase = window.firebase;
        const usersRef = firebase.database().ref('/users');
        const meritsRef = firebase.database().ref('/merits');

        usersRef.orderByChild('status').equalTo('pledge').on('value', (pledges) => {
          if (!pledges.val()) {
            this.setState({ pledges: null, loaded: true });
            return
          }
          pledges = Object.keys(pledges.val()).map(function(key) {
            return pledges.val()[key];
          });

          meritsRef.once('value', (merits) => {
            // Set all the pledge's total merits
            pledges.forEach((pledge) => {
              let totalMerits = 0;
              // Retrieves the pledge's total merits by searching for the key in
              // the Merits table
              if (merits.val() && pledge.Merits) {
                Object.keys(pledge.Merits).forEach(function(key) {
                  if (merits.val()[pledge.Merits[key]]) {
                    totalMerits += merits.val()[pledge.Merits[key]].amount;
                  }
                });
              }
              pledge.totalMerits = totalMerits;
            });

            const { filter } = this.state;
            // Sort the pledges based on the selected filter
            if (this.state.filterName === 'Total Merits') {
              pledges = pledges.sort(function(a, b) {
                return a[filter] < b[filter] ? 1 : -1;
              });
            } else {
              pledges = pledges.sort(function(a, b) {
                return a[filter] >= b[filter] ? 1 : -1;
              });
            }

            localStorage.setItem('pledgeArray', JSON.stringify(pledges));
            this.setState({ pledges, loaded: true });
          });
        });
      });
    }
  }

  componentWillUnmount() {
    const firebase = window.firebase;
    const usersRef = firebase.database().ref('/users');
    usersRef.off('value');
  }

  get pledges(): Node {
    const { pledges } = this.state;
    if (!pledges) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found">No pledges found</h1>
        </div>
      )
    }
    return (
      <List className="garnett-list">
        {pledges.map((pledge, i) => (
          <UserRow
            key={i}
            user={pledge}
            handleOpen={() => this.handleOpen(pledge)}
          />
        ))}
      </List>
    )
  }

  handleOpen = (pledge: User) => {
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleClose);
    this.setState({ pledge, openPledge: true });
  }

  handleClose = () => {
    androidBackClose();
    this.setState({ pledge: null, openPledge: false }, () => {
      iosFullscreenDialogClose();
    });
  }

  openPopover = (event: SyntheticEvent<>) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      openPopover: true,
      anchorEl: event.currentTarget
    });
  };

  closePopover = () => this.setState({ openPopover: false });

  setFilter = (filterName: string) => {
    let filter = filterName.replace(/ /g,'');
    filter = filter[0].toLowerCase() + filter.substr(1);
    let { pledges } = this.state;

    if (filterName === 'Total Merits') {
      pledges = this.state.pledges.sort(function(a, b) {
        return a[filter] < b[filter] ? 1 : -1;
      });
    } else {
      pledges = this.state.pledges.sort(function(a, b) {
        return a[filter] >= b[filter] ? 1 : -1;
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
    const { pledges, reverse } = this.state;
    const reversedPledges = pledges && pledges.reverse();
    this.setState({ pledges: reversedPledges, reverse: !reverse });
  }

  render() {
    const { state } = this.props;
    const {
      loaded,
      pledge,
      filterName,
      reverse,
      openPledge,
      openPopover,
      anchorEl
    } = this.state;

    if (!loaded) {
      return <LoadingComponent />
    }

    return (
      <div id="pledges-container" className="animate-in">
        <FilterHeader
          title={state.status === 'pledge' ? 'Pledge Brothers' : 'Pledges'}
          status={state.status}
          filterName={filterName}
          openPopover={this.openPopover}
          isReversed={reverse}
          reverse={this.reverse}
        />

        { this.pledges }

        {pledge && (
          <LoadablePledgeInfoDialog
            open={openPledge}
            state={state}
            pledge={pledge}
            handleClose={this.handleClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        )}
        {state.status !== 'pledge' && (
          <Filter
            open={openPopover}
            anchorEl={anchorEl}
            filters={filterOptions}
            filterName={filterName}
            closePopover={this.closePopover}
            setFilter={this.setFilter}
          />
        )}
      </div>
    )
  }
}
