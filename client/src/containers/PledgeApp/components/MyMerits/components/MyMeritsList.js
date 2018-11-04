import {
  loadFirebase,
  androidBackOpen,
  androidBackClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { PlaceholderMerit } from 'components/Placeholders';
import { FilterHeader } from 'components';
import { LoadableDeleteMeritDialog } from './index.js';

import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export class MyMeritsList extends PureComponent {
  state = {
    loaded: false,
    myMerits: [],
    selectedMerit: null,
    openDelete: false,
    reverse: false
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const { displayName } = this.props.state;
        const userRef = firebase.database().ref('/users/' + displayName);
        const meritsRef = firebase.database().ref('/merits');

        userRef.child('Merits').on('value', (userMerits) => {
          if (userMerits.val()) {
            meritsRef.once('value', (merits) => {
              let myMerits = [];

              myMerits = Object.keys(userMerits.val()).map(function(key) {
                return merits.val()[userMerits.val()[key]];
              }).sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              });

              localStorage.setItem('myMerits', JSON.stringify(myMerits));

              this.setState({
                myMerits,
                loaded: true
              });
            });
          } else {
            this.setState({
              myMerits: [],
              loaded: true
            })
          }
        });
      });
    }
    else {
      this.setState({ loaded: true });
    }
  }

  handleDeleteOpen = (selectedMerit) => {
    if (navigator.onLine) {
      androidBackOpen(this.handleDeleteClose);
      this.setState({
        selectedMerit,
        openDelete: true
      });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleDeleteClose = () => {
    androidBackClose();
    this.setState({
      openDelete: false,
      selectedMerit: null
    });
  }

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    let { myMerits, reverse } = this.state;
    let toggleIcon = "icon-down-open-mini";
    
    if (!this.state.loaded) {
      return <LoadingComponent />;
    }

    if (reverse) {
      toggleIcon = "icon-up-open-mini";
      myMerits = myMerits.slice().reverse();
    }

    return (
      <List className={`animate-in garnett-list${this.props.hidden ? " hidden" : ""}`}>
        <FilterHeader
          title={reverse ? "Oldest" : "Recent"}
          toggleIcon={toggleIcon}
          reverse={this.reverse}
        />
        {myMerits.map((merit, i) => {
          let name;
          let photoURL;
          if (this.props.state.status === 'pledge') {
            name = merit.activeName;
            photoURL = merit.activePhoto;
          } else {
            name = merit.pledgeName;
            photoURL = merit.pledgePhoto;
          }

          return (
            <LazyLoad
              height={88}
              offset={window.innerHeight}
              once
              overflow
              key={i}
              placeholder={PlaceholderMerit()}
            >
              <div>
                <Divider className="garnett-divider large" inset={true} />
                <ListItem
                  className="garnett-list-item large"
                  leftAvatar={
                    <Avatar
                      size={70}
                      src={photoURL}
                      className="garnett-image large"
                    />
                  }
                  primaryText={<p className="garnett-name"> {name} </p>}
                  secondaryText={
                    <p className="garnett-description"> {merit.description} </p>
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
          )
        })}
        {this.props.state.status === 'pledge' && (
          <LoadableDeleteMeritDialog
            open={this.state.openDelete}
            state={this.props.state}
            merit={this.state.selectedMerit}
            handleDeleteClose={this.handleDeleteClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        )}
      </List>
    )
  }
}
