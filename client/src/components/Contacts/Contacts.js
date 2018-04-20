import ActiveList from './ActiveList';
import API from '../../api/API';
import {LoadingComponent} from '../../helpers/loaders.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

const LoadableContactsDialog = Loadable({
  loader: () => import('./Dialogs/ContactsDialog'),
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
      class: [ 'Charter', 'Alpha', 'Beta', 'Gamma', 
               'Delta', 'Epsilon', 'Zeta', 'Eta', 
               'Theta', 'Iota', 'Kappa', 'Lambda', 
               'Mu', 'Nu', 'Xi', 'Omicron', 
               'Pi', 'Rho'
             ],
      activeClass: ['Lambda', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho'],
      major: [ 'Aerospace Engineering',
               'Bioengineering',
               'Chemical Engineering',
               'Computer Engineering',
               'Computer Science',
               'Electrical Engineering',
               'Environmental Engineering',
               'Mechanical Engineering',
               'Nanoengineering',
               'Structural Engineering'
              ],
      name: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      year: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'],
      actives: this.props.actives,
      active: null,
      filter: 'activeClass',
      filterName: 'Active',
      reverse: false,
      open: false,
      openPopover: false
    }
  }

  componentWillMount() {
    if (navigator.onLine) {
      API.getActives()
      .then(res => {
        localStorage.setItem('activeArray', JSON.stringify(res.data));

        this.setState({
          actives: res.data,
          labels: this.state.activeClass
        });
      });
    }
    else {
      this.setState({
        labels: this.state.activeClass
      });
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
      open: true,
      active: active
    });
  }

  handleClose = () => {
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

    this.setState({
      openPopover: false,
      labels: this.state[labelFilter],
      filter: filter,
      filterName: filterName,
      reverse: false
    });
  }

  reverse = () => {
    let reverse = true;
    let labels = this.state.labels.slice().reverse();

    if (this.state.reverse) {
      reverse = false;
    }

    this.setState({
      labels: labels,
      reverse: reverse
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
              <Subheader className="garnett-subheader">
                {label}
                {i === 0 && (
                  <span style={{float:'right'}}>
                    <span style={{cursor:'pointer'}} onClick={this.openPopover}> 
                      {this.state.filterName}
                    </span>
                    <IconButton
                      iconClassName={toggleIcon}
                      className="reverse-toggle"
                      onClick={this.reverse}
                    >
                    </IconButton>
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
              <Divider className="garnett-subheader" />
            </div>
          ))}

          <Popover
            open={this.state.openPopover}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.closePopover}
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