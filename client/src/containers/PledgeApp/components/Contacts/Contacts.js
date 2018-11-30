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

import React, { PureComponent } from 'react';
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

export class Contacts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      actives: [],
      active: null,
      filter: 'activeClass',
      filterName: 'Active',
      reverse: false,
      open: false,
      openPopover: false
    }
  }

  componentDidMount() {
    const labels = filters.activeClass;

    if (navigator.onLine) {
      API.getActives()
      .then(res => {
        const actives = res.data;

        localStorage.setItem('activeArray', JSON.stringify(res.data));

        this.setState({ actives, labels });
      });
    }
    else {
      const actives = localStorage.getItem('activeArray');
      this.setState({ actives, labels });
    }
  }

  checkCondition(active, label) {
    switch (this.state.filter) {
      case 'firstName':
      case 'lastName':
        return active[this.state.filter].startsWith(label);
      case 'activeClass':
        return active.status !== 'alumni' && active.class === label;
      case 'alumni':
        return active.status === 'alumni' && active.class === label;
      default:
        return active[this.state.filter] === label;
    }
  }

  handleOpen = (active) => {
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleClose);
    this.setState({
      active,
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
      anchorEl: event.currentTarget
    });
  };

  closePopover = () => {
    this.setState({ openPopover: false });
  };

  setFilter = (filterName) => {
    let filter = filterName.replace(/ /g,'');
    filter = filter[0].toLowerCase() + filter.substr(1);
    let labelFilter = filter;

    if (filterName === 'Active') {
      filter += 'Class';
      labelFilter += 'Class';
    }
    else if (filterName === 'First Name' || filterName === 'Last Name') {
      labelFilter = 'name';
    }
    else if (filterName === 'Alumni') {
      labelFilter = 'class';
    }
    else if (filterName === 'Personality Type') {
      filter = 'mbti';
      labelFilter = 'mbti';
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
      labels: labels.slice().reverse(),
      reverse: !reverse
    });
  }

  render() {
    if (this.props.hidden) {
      return null;
    }

    if (!this.state.labels) {
      return <LoadingComponent />
    }

    return (
      <div className="animate-in">
        {this.state.labels.map((label, index) => (
          <div key={index}>
            {index === 0 ? (
              <FilterHeader
                className="garnett-subheader contacts"
                title={label}
                filterName={this.state.filterName}
                openPopover={this.openPopover}
                isReversed={this.state.reverse}
                reverse={this.reverse}
              />
            ) : (
              <Subheader className="garnett-subheader contacts">
                {label}
              </Subheader>
            )}
            <List className="garnett-list">
              {this.state.actives.map((active, i) => (
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
        ))}
        <Filter
          open={this.state.openPopover}
          anchorEl={this.state.anchorEl}
          filters={filterOptions}
          filterName={this.state.filterName}
          closePopover={this.closePopover}
          setFilter={this.setFilter}
        />
        {this.state.active && (
          <LoadableContactsDialog
            open={this.state.open}
            active={this.state.active}
            handleClose={this.handleClose}
          />
        )}
      </div>
    )
  }
}
