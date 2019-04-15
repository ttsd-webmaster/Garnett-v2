// @flow

import './Pledges.css';

import API from 'api/API.js';
import {
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
    API.getPledges(this.props.state.displayName)
    .then(res => {
      let pledges = res.data;
      const { filter } = this.state;
      // Sort the pledges based on the selected filter
      if (filter === 'totalMerits') {
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
  }

  componentWillUnmount() {
    const firebase = window.firebase;
    const meritsRef = firebase.database().ref('/merits');
    meritsRef.off('value');
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

  get filterLabel(): string {
    switch (this.state.filter) {
      case 'lastName':
        return 'Last Name';
      case 'firstName':
        return 'First Name';
      case 'year':
        return 'Year';
      case 'major':
        return 'Major';
      case 'totalMerits':
        return 'Total Merits';
      default:
        return ''
    }
  }

  handleOpen = (pledge: User) => {
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleClose);
    this.setState({ pledge, openPledge: true });
  }

  handleClose = () => {
    androidBackClose();
    this.setState({ openPledge: false }, () => {
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
    let { pledges } = this.state;
    let filter = filterName.replace(/ /g, '');
    filter = filter[0].toLowerCase() + filter.substr(1);

    if (filter === 'totalMerits') {
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
          filterName={this.filterLabel}
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
        <Filter
          open={openPopover}
          anchorEl={anchorEl}
          filters={filterOptions}
          filterName={this.filterLabel}
          closePopover={this.closePopover}
          setFilter={this.setFilter}
        />
      </div>
    )
  }
}
