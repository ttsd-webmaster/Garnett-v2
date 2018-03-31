import '../MeritBook.css';
import {loadFirebase} from '../../../helpers/functions.js';
import {LoadingComponent} from '../../../helpers/loaders.js';
import API from '../../../api/API.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const LoadableActiveMeritDialog = Loadable({
  loader: () => import('./ActiveMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

const LoadableActiveMeritAllDialog = Loadable({
  loader: () => import('./ActiveMeritAllDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      pledges: this.props.pledges,
      open: false,
      openMeritAll: false,
      pledge: null,
      merits: [],
      remainingMerits: ''
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let pledges;
        let firebase = window.firebase;
        let dbRef = firebase.database().ref('/users');

        dbRef.on('value', (snapshot) => {
          pledges = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          });
          pledges = pledges.filter(function(user) {
            return user.status === 'pledge';
          });
          pledges.sort((a, b) => {
            return a.lastName > b.lastName ? 1 : -1;
          });

          console.log('Pledge array: ', pledges);

          localStorage.setItem('pledgeArray', JSON.stringify(pledges));
          
          this.setState({
            loaded: true,
            pledges: pledges
          });
        });
      });
    }
    else {
      this.setState({
        loaded: true
      });
    }
  }

  componentDidUpdate() {
    let meritAll = document.getElementById('merit-all');

    if (meritAll) {
      if (this.props.index === 0) {
        meritAll.style.display = 'flex';
      }
      else {
        meritAll.style.display = 'none';
      }
    }
  }

  handleOpen = (pledge) => {
    let displayName = this.props.state.displayName;

    if (navigator.onLine) {
      API.getActiveRemainingMerits(displayName, pledge)
      .then(res => {
        this.setState({
          open: true,
          pledge: pledge,
          remainingMerits: res.data.remainingMerits
        });
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }

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
  }

  handleClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({
      open: false
    });
  }

  handleMeritAllOpen = () => {
    if (navigator.onLine) {
      this.setState({
        openMeritAll: true
      });
    }
    else {
      this.handleRequestOpen('You are offline.');
    }

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
        this.handleMeritAllClose();
      }
    }
  }

  handleMeritAllClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({
      openMeritAll: false
    });
  }

  render() {
    return (
      this.state.loaded ? (
        <div className="animate-in">
          <List className="garnett-list">
            <Subheader> Pledges </Subheader>
            {this.state.pledges.map((pledge, i) => (
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

          <div id="merit-all" className="fixed-button" onClick={this.handleMeritAllOpen}>
            <i className="icon-pencil"></i>
          </div>
          
          <LoadableActiveMeritDialog
            open={this.state.open}
            state={this.props.state}
            pledge={this.state.pledge}
            remainingMerits={this.state.remainingMerits}
            merits={this.state.merits}
            handleClose={this.handleClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />

          <LoadableActiveMeritAllDialog
            open={this.state.openMeritAll}
            state={this.props.state}
            handleMeritAllClose={this.handleMeritAllClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
