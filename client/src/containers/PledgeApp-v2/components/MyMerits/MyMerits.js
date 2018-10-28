import 'containers/PledgeApp/components/MeritBook/MeritBook.css';
import {loadFirebase} from 'helpers/functions.js';
import {LoadingComponent} from 'helpers/loaders.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

const LoadableDeleteMeritDialog = Loadable({
  loader: () => import('./Dialogs/DeleteMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

export class MyMerits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      merits: this.props.merits,
      merit: null,
      openDelete: false,
      reverse: false
    }
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const { displayName } = this.props.state;
        const userRef = firebase.database().ref('/users/' + displayName);

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

          this.setState({
            loaded: true,
            merits: merits,
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
                      {merit.amount > 0 ? (
                        <p className="merit-amount green">+{merit.amount}</p>
                      ) : (
                        <p className="merit-amount red">{merit.amount}</p>
                      )}
                    </div>
                  </ListItem>
                  <Divider className="garnett-divider large" inset={true} />
                </div>
              </LazyLoad>
            ))}
          </List>

          {this.props.state.status === 'pledge' && (
            <LoadableDeleteMeritDialog
              open={this.state.openDelete}
              state={this.props.state}
              merit={this.state.merit}
              handleDeleteClose={this.handleDeleteClose}
              handleRequestOpen={this.props.handleRequestOpen}
            />
          )}
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
