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
  pledges: Array<User>,
  pledge: ?User,
  filter: string,
  filterName: string,
  reverse: boolean,
  open: boolean,
  openMerit: boolean,
  openPopover: boolean
};

export class Pledges extends PureComponent<Props, State> {
  state = {
    loaded: false,
    pledges: null,
    pledge: null,
    filter: 'lastName',
    filterName: 'Last Name',
    reverse: false,
    open: false,
    openMerit: false,
    openPopover: false
  };

  componentDidMount() {
    if (!navigator.onLine) {
      this.setState({ loaded: true });
      return
    }
    if (this.props.state.status === 'pledge') {
      API.getPbros(this.props.state.displayName)
      .then(res => {
        const pledges = res.data;
        localStorage.setItem('pbros', JSON.stringify(pledges));

        this.setState({ pledges, loaded: true });
      })
      .catch(error => console.log(`Error: ${error}`));
    } else {
      loadFirebase('database')
      .then(() => {
        const firebase = window.firebase;
        const usersRef = firebase.database().ref('/users');

        usersRef.orderByChild('status').equalTo('pledge').on('value', (pledge) => {
          const { filter } = this.state;

          if (!pledge.val()) {
            this.setState({ pledges: null, loaded: true });
            return
          }
          let pledges = Object.keys(pledge.val()).map(function(key) {
            return pledge.val()[key];
          });

          if (this.state.filterName === 'Total Merits') {
            pledges = pledges.sort(function(a, b) {
              return a[filter] < b[filter] ? 1 : -1;
            });
          } else {
            pledges = pledges.sort(function(a, b) {
              return a[filter] > b[filter] ? 1 : -1;
            });
          }

          localStorage.setItem('pledgeArray', JSON.stringify(pledges));

          this.setState({ pledges, loaded: true });
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
      return <h1 className="no-items-found">No pledges found</h1>;
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
    this.setState({ pledge, open: true });
  }

  handleClose = () => {
    androidBackClose();
    this.setState({ open: false }, () => {
      iosFullscreenDialogClose();
    });
  }

  openPopover = (event: SyntheticEvent<>) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      openPopover: true,
      anchorEl: event.currentTarget,
    });
  };

  closePopover = () => this.setState({ openPopover: false });

  setFilter = (filterName: string) => {
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
    const { pledges, reverse } = this.state;
    const reversedPledges = pledges && pledges.reverse();
    this.setState({ pledges: reversedPledges, reverse: !reverse });
  }

  render() {
    const { state } = this.props;
    const { loaded, reverse } = this.state;

    if (!loaded) {
      return <LoadingComponent />
    }
    return (
      <div id="pledges-container" className="garnett-container animate-in">
        <FilterHeader
          title={state.status === 'pledge' ? 'Pledge Brothers' : 'Pledges'}
          status={state.status}
          filterName={this.state.filterName}
          openPopover={this.openPopover}
          isReversed={reverse}
          reverse={this.reverse}
        />

        { this.pledges }

        <LoadablePledgeInfoDialog
          open={this.state.open}
          state={state}
          pledge={this.state.pledge}
          handleClose={this.handleClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />
        {state.status !== 'pledge' && (
          <Filter
            open={this.state.openPopover}
            anchorEl={this.state.anchorEl}
            filters={filterOptions}
            filterName={this.state.filterName}
            closePopover={this.closePopover}
            setFilter={this.setFilter}
          />
        )}
      </div>
    )
  }
}
