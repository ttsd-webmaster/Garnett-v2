import './Contacts.css';
import filters from './data.js';
import API from 'api/API';
import {
  isMobileDevice,
  androidBackOpen,
  androidBackClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { Header } from './components/Header';
import { ActiveList } from './components/ActiveList';
import { Filter } from './components/Filter';
import { LoadableContactsDialog } from './components/Dialogs';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';

export default class Contacts extends PureComponent {
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

  handleOpen = (active) => {
    if (isMobileDevice()) {
      androidBackOpen(this.handleClose);
    }

    this.setState({
      active,
      open: true
    });
  }

  handleClose = () => {
    if (isMobileDevice()) {
      androidBackClose();
    }

    this.setState({ open: false });
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
    let toggleIcon = "icon-down-open-mini";

    if (this.state.reverse) {
      toggleIcon = "icon-up-open-mini";
    }

    return (
      this.state.labels ? (
        <div className={`animate-in${this.props.hidden ? " hidden" : ""}`}>
          {this.state.labels.map((label, index) => (
            <div key={index}>
              <Header
                index={index}
                label={label}
                toggleIcon={toggleIcon}
                filterName={this.state.filterName}
                openPopover={this.openPopover}
                reverse={this.reverse}
              />
              <List className="garnett-list">
                <ActiveList 
                  actives={this.state.actives}
                  label={label}
                  filter={this.state.filter}
                  handleOpen={this.handleOpen}
                />
              </List>
            </div>
          ))}
          <Filter
            open={this.state.openPopover}
            anchorEl={this.state.anchorEl}
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
      ) : (
        <LoadingComponent />
      )
    )
  }
}
