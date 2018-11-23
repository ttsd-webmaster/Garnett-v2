import {
  loadFirebase,
  androidBackOpen,
  androidBackClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader, MeritRow } from 'components';
import { LoadableDeleteMeritDialog } from './index.js';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';

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
        const userMeritsRef = firebase.database().ref('/users/' + displayName + '/Merits');
        const meritsRef = firebase.database().ref('/merits');

        userMeritsRef.on('value', (userMerits) => {
          if (userMerits.val()) {
            meritsRef.orderByChild('date').once('value', (merits) => {
              // Retrieves the user's merits by searching for the key in
              // the Merits table
              const myMerits = Object.keys(userMerits.val()).map(function(key) {
                return merits.val()[userMerits.val()[key]];
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

    if (this.props.hidden) {
      return null;
    }
    
    if (!this.state.loaded) {
      return <LoadingComponent className={this.props.hidden ? "hidden" : ""} />;
    }

    if (reverse) {
      toggleIcon = "icon-up-open-mini";
      myMerits = myMerits.slice().reverse();
    }

    return (
      <List className="animate-in garnett-list">
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
            <MeritRow
              key={i}
              merit={merit}
              photo={photoURL}
              name={name}
              handleDeleteOpen={this.handleDeleteOpen}
            />
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
