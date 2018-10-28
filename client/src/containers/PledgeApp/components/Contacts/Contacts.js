import './Contacts.css';
import filters from './data.js';
import ActiveList from './components/ActiveList';
import API from 'api/API';
import { LoadingComponent } from 'helpers/loaders.js';

import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

const LoadableContactsDialog = Loadable({
  loader: () => import('./components/Dialogs/ContactsDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actives: this.props.actives,
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
      this.setState({ labels });
    }
  }

  handleOpen = (active) => {
    // Handles android back button
    if (/android/i.test(navigator.userAgent)) {
      let path;
      if (process.env.NODE_ENV === 'development') {
        path = 'http://localhost:3000';
      }
      else {
        path = 'https://garnett-app.herokuapp.com';
      }

      window.history.pushState(null, null, path + window.location.pathname);
      window.onpopstate = () => {
        this.handleClose();
      }
    }

    this.setState({
      active,
      open: true
    });
  }

  handleClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
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
        <div>
          {this.state.labels.map((label, i) => (
            <div key={i}>
              <Subheader className="garnett-subheader contacts">
                {label}
                {i === 0 && (
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
                )}
              </Subheader>
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
                primaryText="Active"
                insetChildren
                checked={this.state.filterName === 'Active'}
                onClick={() => this.setFilter('Active')}
              />
              <MenuItem
                primaryText="Alumni"
                insetChildren
                checked={this.state.filterName === 'Alumni'}
                onClick={() => this.setFilter('Alumni')}
              />
              <MenuItem
                primaryText="Class"
                insetChildren
                checked={this.state.filterName === 'Class'}
                onClick={() => this.setFilter('Class')}
              />
              <MenuItem
                primaryText="Major"
                insetChildren
                checked={this.state.filterName === 'Major'}
                onClick={() => this.setFilter('Major')}
              />
              <MenuItem
                primaryText="Year"
                insetChildren
                checked={this.state.filterName === 'Year'}
                onClick={() => this.setFilter('Year')}
              />
              <MenuItem
                primaryText="First Name"
                insetChildren
                checked={this.state.filterName === 'First Name'}
                onClick={() => this.setFilter('First Name')}
              />
              <MenuItem
                primaryText="Last Name"
                insetChildren
                checked={this.state.filterName === 'Last Name'}
                onClick={() => this.setFilter('Last Name')}
              />
              <MenuItem
                primaryText="Personality Type"
                insetChildren
                checked={this.state.filterName === 'Personality Type'}
                onClick={() => this.setFilter('Personality Type')}
              />
            </Menu>
          </Popover>

          <LoadableContactsDialog
            open={this.state.open}
            active={this.state.active}
            handleClose={this.handleClose}
          />
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}