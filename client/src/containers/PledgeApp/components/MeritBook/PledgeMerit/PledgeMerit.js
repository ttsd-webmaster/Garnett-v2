import TotalMeritsAndPledgeBrothers from './components/TotalMeritsAndPledgeBrothers';
import { loadFirebase } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import API from 'api/API.js';

import React, { Component } from 'react';
import { Portal } from 'react-portal';
import Loadable from 'react-loadable';
import LazyLoad from 'react-lazyload';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

const LoadableDeleteMeritDialog = Loadable({
  loader: () => import('./components/Dialogs/DeleteMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

const LoadablePledgeMeritDialog = Loadable({
  loader: () => import('./components/Dialogs/PledgeMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

export default class PledgeMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      merits: this.props.merits,
      totalMerits: this.props.totalMerits,
      previousTotalMerits: 0,
      pbros: this.props.pbros,
      merit: null,
      openDelete: false,
      openMerit: false,
      openPbros: false,
      reverse: false
    }
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let fullName = this.props.state.displayName;
        let userRef = firebase.database().ref('/users/' + fullName);

        userRef.on('value', (user) => {
          let totalMerits = user.val().totalMerits;

          console.log(`Total Merits: ${totalMerits}`);
          localStorage.setItem('totalMerits', totalMerits);

          userRef.child('Merits').on('value', (snapshot) => {
            let merits = [];

            if (snapshot.val()) {
              merits = Object.keys(snapshot.val()).map(function(key) {
                return snapshot.val()[key];
              }).sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              });
            }

            console.log(`Merit array: ${merits}`);
            localStorage.setItem('meritArray', JSON.stringify(merits));
            localStorage.setItem('totalMerits', totalMerits);

            this.setState({
              loaded: true,
              totalMerits: totalMerits,
              previousTotalMerits: this.state.totalMerits,
              merits: merits,
            });
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
    let meritButton = document.querySelector('.fixed-button');

    if (meritButton) {
      if (this.props.index === 0) {
        meritButton.classList.remove('hidden');
      }
      else {
        meritButton.classList.add('hidden');
      }
    }
  }

  handleDeleteOpen = (merit) => {
    if (navigator.onLine) {
      this.setState({
        openDelete: true,
        merit: merit
      });

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
          this.handleDeleteClose();
        }
      }
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleDeleteClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({
      openDelete: false,
      merit: null
    });
  }

  handleMeritOpen = () => {
    if (navigator.onLine) {
      this.setState({
        openMerit: true
      });

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
          this.handleMeritClose();
        }
      }
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleMeritClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({
      openMerit: false
    });
  }

  openBottomSheet = (open) => {
    if (navigator.onLine) {
      API.getPbros()
      .then(res => {
        localStorage.setItem('pbros', JSON.stringify(res.data));

        this.setState({
          openPbros: open,
          pbros: res.data
        });
      })
      .catch(error => console.log(`Error: ${error}`));
    }
    else {
      this.setState({
        openPbros: open
      });
    }
  }

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    let toggleIcon = "icon-down-open-mini";
    let { merits, reverse } = this.state;

    if (reverse) {
      merits = merits.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    return (
      this.state.loaded ? (
        <div id="pledge-meritbook" className="animate-in">
          <Subheader className="garnett-subheader">
            Recent
            <IconButton
              style={{float:'right',cursor:'pointer'}}
              iconClassName={toggleIcon}
              className="reverse-toggle"
              onClick={this.reverse}
            />
          </Subheader>

          <List className="animate-in garnett-list">
            {merits.map((merit, i) => (
              <LazyLoad
                height={88}
                offset={window.innerHeight}
                once
                overflow
                key={i}
                placeholder={
                  <div className="placeholder-skeleton">
                    <Divider className="garnett-divider large" inset={true} />
                    <div className="placeholder-avatar"></div>
                    <div className="placeholder-name"></div>
                    <div className="placeholder-year"></div>
                    <div className="placeholder-date"></div>
                    <div className="placeholder-merits"></div>
                    <Divider className="garnett-divider large" inset={true} />
                  </div>
                }
              >
                <div>
                  <Divider className="garnett-divider large" inset={true} />
                  <ListItem
                    className="garnett-list-item large"
                    leftAvatar={<Avatar size={70} src={merit.photoURL} className="garnett-image large" />}
                    primaryText={
                      <p className="garnett-name"> {merit.name} </p>
                    }
                    secondaryText={
                      <p> {merit.description} </p>
                    }
                    secondaryTextLines={2}
                    onClick={() => this.handleDeleteOpen(merit)}
                  >
                    <div className="merit-amount-container">
                      <p className="merit-date"> {merit.date} </p>
                      <p className={
                        merit.amount > 0
                          ? "merit-amount green"
                          : "merit-amount red"
                      }>
                        {merit.amount}
                      </p>
                    </div>
                  </ListItem>
                  <Divider className="garnett-divider large" inset={true} />
                </div>
              </LazyLoad>
            ))}
          </List>

          <Portal>
            <FloatingActionButton className="fixed-button" onClick={this.handleMeritOpen}>
              <i className="icon-pencil"></i>
            </FloatingActionButton>
          </Portal>

          <TotalMeritsAndPledgeBrothers
            previousTotalMerits={this.state.previousTotalMerits}
            totalMerits={this.state.totalMerits}
            pbros={this.state.pbros}
            openPbros={this.state.openPbros}
            openBottomSheet={this.openBottomSheet}
          />

          <LoadableDeleteMeritDialog
            open={this.state.openDelete}
            state={this.props.state}
            merit={this.state.merit}
            handleDeleteClose={this.handleDeleteClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />

          <LoadablePledgeMeritDialog
            open={this.state.openMerit}
            state={this.props.state}
            handleMeritClose={this.handleMeritClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
