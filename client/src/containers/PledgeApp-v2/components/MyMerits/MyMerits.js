import 'containers/PledgeApp/components/MeritBook/MeritBook.css';
import { loadFirebase, androidBackOpen, androidBackClose } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader } from 'components/FilterHeader';
import { MyMeritsList } from './components/MyMeritsList';
import { LoadableDeleteMeritDialog } from './Dialogs';

import React, { PureComponent } from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export class MyMerits extends PureComponent {
  state = {
    loaded: false,
    merits: this.props.merits,
    merit: null,
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

        userRef.child('Merits').on('value', (snapshot) => {
          let merits = [];

          if (snapshot.val()) {
            merits = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            }).sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });
          }

          localStorage.setItem('meritArray', JSON.stringify(merits));

          this.setState({
            merits,
            loaded: true
          });
        });
      });
    }
    else {
      this.setState({ loaded: true });
    }
  }

  handleDeleteOpen = (merit) => {
    if (navigator.onLine) {
      androidBackOpen(this.handleDeleteClose);
      this.setState({
        merit,
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
          <FilterHeader
            title="Recent"
            toggleIcon={toggleIcon}
            filterName={this.state.filterName}
            openPopover={this.openPopover}
            reverse={this.reverse}
          />
          <MyMeritsList
            merits={merits}
            handleDeleteOpen={this.handleDeleteOpen}
          />
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
