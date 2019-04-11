// @flow

import { androidBackOpen, androidBackClose } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader, MeritRow } from 'components';
import { LoadableDeleteMeritDialog } from './Dialogs';
import type { User, Merit } from 'api/models';

import React, { Fragment, PureComponent, type Node } from 'react';
import { List } from 'material-ui/List';

type Props = {
  state: User,
  handleRequestOpen: () => void
};

type State = {
  loaded: boolean,
  myMerits: Array<Merit>,
  selectedMerit: ?Merit,
  openDelete: boolean,
  reverse: boolean
};

export class MyMeritsList extends PureComponent<Props, State> {
  state = {
    loaded: false,
    myMerits: [],
    selectedMerit: null,
    openDelete: false,
    reverse: false
  }

  componentDidMount() {
    if (!navigator.onLine) {
      this.setState({ loaded: true });
      return
    }
    const { firebase } = window;
    const { displayName } = this.props.state;
    const userMeritsRef = firebase.database().ref(`/users/${displayName}/Merits`);
    const meritsRef = firebase.database().ref('/merits');

    userMeritsRef.on('value', (userMerits) => {
      if (!userMerits.val()) {
        this.setState({ loaded: true });
        return
      }
      meritsRef.on('value', (merits) => {
        let myMerits = [];
        // Retrieves the user's merits by searching for the key in
        // the Merits table
        if (userMerits.val() && merits.val()) {
          myMerits = Object.keys(userMerits.val()).map(function(key) {
            return merits.val()[userMerits.val()[key]];
          }).reverse();
        }
        localStorage.setItem('myMerits', JSON.stringify(myMerits));
        this.setState({ myMerits, loaded: true });
      });
    });
  }

  componentWillUnmount() {
    const { firebase } = window;
    const { displayName } = this.props.state;
    const userMeritsRef = firebase.database().ref(`/users/${displayName}/Merits`);
    const meritsRef = firebase.database().ref('/merits');
    userMeritsRef.off('value');
    meritsRef.off('value');
  }

  get merits(): Node {
    const { state } = this.props;
    const { myMerits } = this.state;
    const isPledge = state.status === 'pledge';
    if (myMerits.length === 0) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found">No merits entered</h1>
        </div>
      )
    }
    return (
      <List className="animate-in garnett-list">
        {myMerits.map((merit, i) => {
          if (!merit) {
            return null;
          }
          const { activeName, activePhoto, pledgeName, pledgePhoto } = merit;
          return (
            <MeritRow
              key={i}
              merit={merit}
              photo={isPledge ? activePhoto : pledgePhoto}
              name={isPledge ? activeName : pledgeName}
              handleDeleteOpen={isPledge ? null : this.handleDeleteOpen}
            />
          )
        })}
      </List>
    )
  }

  handleDeleteOpen = (selectedMerit: Merit) => {
    if (!navigator.onLine) {
      this.props.handleRequestOpen('You are offline');
      return;
    }
    androidBackOpen(this.handleDeleteClose);
    this.setState({ selectedMerit, openDelete: true });
  }

  handleDeleteClose = () => {
    androidBackClose();
    this.setState({ selectedMerit: null, openDelete: false });
  }

  reverse = () => {
    const { myMerits, reverse } = this.state;
    const reversedMerits = myMerits.reverse();
    this.setState({ myMerits: reversedMerits, reverse: !reverse });
  }

  render() {
    const { state, handleRequestOpen } = this.props;
    const { reverse, loaded, openDelete, selectedMerit } = this.state;
    if (!loaded) {
      return <LoadingComponent />;
    }
    return (
      <Fragment>
        <FilterHeader isReversed={reverse} reverse={this.reverse} />

        { this.merits }

        {this.props.state.status !== 'pledge' && (
          <LoadableDeleteMeritDialog
            open={openDelete}
            state={state}
            merit={selectedMerit}
            handleDeleteClose={this.handleDeleteClose}
            handleRequestOpen={handleRequestOpen}
          />
        )}
      </Fragment>
    )
  }
}
