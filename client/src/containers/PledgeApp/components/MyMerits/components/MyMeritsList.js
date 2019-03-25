// @flow

import {
  loadFirebase,
  androidBackOpen,
  androidBackClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader, MeritRow } from 'components';
import { LoadableDeleteMeritDialog } from './Dialogs';
import type { User, Merit } from 'api/models';

import React, { Fragment, PureComponent } from 'react';
import { List } from 'material-ui/List';

type Props = {
  state: User,
  hidden: boolean,
  handleRequestOpen: () => void
};

type State = {
  loaded: boolean,
  myMerits: ?Array<Merit>,
  selectedMerit: ?Merit,
  openDelete: boolean,
  reverse: boolean
};

export class MyMeritsList extends PureComponent<Props, State> {
  state = {
    loaded: false,
    myMerits: null,
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
            meritsRef.on('value', (merits) => {
              // Retrieves the user's merits by searching for the key in
              // the Merits table
              const myMerits = Object.keys(userMerits.val()).map(function(key) {
                return merits.val()[userMerits.val()[key]];
              }).reverse();

              localStorage.setItem('myMerits', JSON.stringify(myMerits));

              this.setState({ myMerits, loaded: true });
            });
          } else {
            this.setState({ myMerits: null, loaded: true });
          }
        });
      });
    } else {
      this.setState({ loaded: true });
    }
  }

  handleDeleteOpen = (selectedMerit: Merit) => {
    if (navigator.onLine) {
      androidBackOpen(this.handleDeleteClose);
      this.setState({
        selectedMerit,
        openDelete: true
      });
    } else {
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

  reverse = () => this.setState({ reverse: !this.state.reverse });

  render() {
    let { myMerits, reverse, loaded, openDelete, selectedMerit } = this.state;
    const { hidden, state, handleRequestOpen } = this.props;

    if (hidden) {
      return null;
    }
    
    if (!loaded) {
      return <LoadingComponent className={hidden ? "hidden" : ""} />;
    }

    if (myMerits && reverse) {
      myMerits = myMerits.slice().reverse();
    }

    return (
      <Fragment>
        <List className="animate-in garnett-list">
          <FilterHeader
            title={reverse ? "Oldest" : "Recent"}
            isReversed={reverse}
            reverse={this.reverse}
          />
          {myMerits && myMerits.map((merit, i) => {
            if (!merit) {
              return null
            }
            const { activeName, activePhoto, pledgeName, pledgePhoto } = merit;
            return (
              <MeritRow
                key={i}
                merit={merit}
                photo={state.status === 'pledge' ? activePhoto : pledgePhoto}
                name={state.status === 'pledge' ? activeName : pledgeName}
                handleDeleteOpen={this.handleDeleteOpen}
              />
            )
          })}
        </List>
        <LoadableDeleteMeritDialog
          open={openDelete}
          state={state}
          merit={selectedMerit}
          handleDeleteClose={this.handleDeleteClose}
          handleRequestOpen={handleRequestOpen}
        />
      </Fragment>
    )
  }
}
