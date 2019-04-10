// @flow

import './Contacts.css';
import filters from './data.js';
import API from 'api/API';
import {
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { Filter, FilterHeader, UserRow } from 'components';
import { LoadableContactsDialog } from './components/Dialogs';
import type { FilterType, FilterName } from './data.js';
import type { User } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

const filterOptions = [
  'Active', 
  'Alumni', 
  'Class', 
  'Major', 
  'Year', 
  'First Name', 
  'Last Name', 
  'Personality Type'
];

type State = {
  actives: Array<User>,
  active: ?User,
  filter: FilterType,
  filterName: FilterName,
  labels: ?Array<string>,
  reverse: boolean,
  open: boolean,
  openPopover: boolean
};

export class Contacts extends PureComponent<{}, State> {
  state = {
    actives: null,
    active: null,
    filter: 'active',
    filterName: 'Active',
    labels: null,
    reverse: false,
    open: false,
    openPopover: false
  };

  componentDidMount() {
    const labels = filters.active;
    if (navigator.onLine) {
      API.getActives()
      .then(res => {
        const actives = res.data;
        localStorage.setItem('activeArray', JSON.stringify(res.data));
        this.setState({ actives, labels });
      });
    } else {
      const actives = localStorage.getItem('activeArray');
      this.setState({ actives, labels });
    }
  }

  get body(): Node {
    const { actives, labels } = this.state;
    const groups = [];
    if (!actives || !labels) {
      return null;
    }
    labels.forEach((label, index) => {
      const group = (
        <div key={index}>
          { this.header(label, index) }

          <List className="garnett-list">
            {actives.map((active, i) => (
              this.checkCondition(active, label) && (
                <UserRow
                  key={i}
                  user={active}
                  handleOpen={() => this.handleOpen(active)}
                />
              )
            ))}
          </List>
        </div>
      );
      groups.push(group);
    })
    return groups;
  }

  get modalTitle(): string {
    switch (this.state.filter) {
      case 'active':
        return 'Active';
      case 'alumni':
        return 'Alumni';
      default:
        return 'Brother';
    }
  }

  header = (label: string, index: number): Node => {
    if (index === 0) {
      return (
        <FilterHeader
          className="garnett-subheader contacts"
          title={label}
          filterName={this.state.filterName}
          openPopover={this.openPopover}
          isReversed={this.state.reverse}
          reverse={this.reverse}
        />
      )
    }
    return (
      <Subheader className="garnett-subheader contacts">
        { label }
      </Subheader>
    )
  }

  checkCondition(active: User, label: string): boolean {
    switch (this.state.filter) {
      case 'active':
        return active.status !== 'alumni' && active.class === label;
      case 'alumni':
        return active.status === 'alumni' && active.class === label;
      case 'firstName':
        return active.firstName.startsWith(label);
      case 'lastName':
        return active.lastName.startsWith(label);
      default:
        return active[this.state.filter] === label;
    }
  }

  handleOpen = (active: User) => {
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleClose);
    this.setState({ active, open: true });
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
      anchorEl: event.currentTarget
    });
  };

  closePopover = () => this.setState({ openPopover: false });

  setFilter = (filterName: FilterName) => {
    let filter = filterName.replace(/ /g,'');
    // Make first letter of filter lower cased
    filter = filter[0].toLowerCase() + filter.substr(1);
    let labelFilter = filter;

    switch (filterName) {
      case 'Active':
        labelFilter = 'active';
        break
      case 'Alumni':
        labelFilter = 'class';
        break
      case 'First Name':
      case 'Last Name':
        labelFilter = 'name';
        break
      case 'Personality Type':
        filter = 'mbti';
        labelFilter = 'mbti';
        break
      default:
    }

    const labels = filters[labelFilter];

    this.setState({
      filter,
      filterName,
      labels,
      openPopover: false,
      reverse: false
    });
  }

  reverse = () => {
    const { labels, reverse } = this.state;
    this.setState({
      labels: labels.reverse(),
      reverse: !reverse
    });
  }

  render() {
    if (!this.state.labels || !this.state.actives) {
      return <LoadingComponent />
    }

    return (
      <div className="animate-in">
        <Filter
          open={this.state.openPopover}
          anchorEl={this.state.anchorEl}
          filters={filterOptions}
          filterName={this.state.filterName}
          closePopover={this.closePopover}
          setFilter={this.setFilter}
        />

        { this.body }

        {this.state.active && (
          <LoadableContactsDialog
            open={this.state.open}
            active={this.state.active}
            title={this.modalTitle}
            handleClose={this.handleClose}
          />
        )}
      </div>
    )
  }
}
