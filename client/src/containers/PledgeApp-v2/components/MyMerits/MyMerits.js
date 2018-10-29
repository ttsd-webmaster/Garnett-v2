import './MyMerits.css';
import {
  isMobileDevice,
  loadFirebase,
  androidBackOpen,
  androidBackClose
} from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader } from 'components/FilterHeader';
import { MyMeritsList } from './components/MyMeritsList';
import { LoadableDeleteMeritDialog } from './Dialogs';
import {
  LoadablePledgeMeritDialog,
  LoadableActiveMeritDialog
} from '../Dialogs';

import React, { PureComponent, Fragment } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CountUp from 'react-countup';

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
        <div className={`animate-in${this.props.hidden ? " hidden" : ""}`}>
          {isMobileDevice() && (
            <div className="total-merits-container">
              <CountUp
                className="total-merits"
                start={this.props.previousTotalMerits}
                end={this.props.totalMerits}
                useEasing
              />
              merits {this.props.state.status !== 'pledge' && 'merited'}
            </div>
          )}
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
          {isMobileDevice() && (
            <Fragment>
              {this.props.state.status === 'pledge' ? (
                <LoadablePledgeMeritDialog
                  open={this.props.openMerit}
                  state={this.props.state}
                  handleMeritClose={this.props.handleMeritClose}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              ) : (
                <LoadableActiveMeritDialog
                  open={this.props.openMerit}
                  state={this.props.state}
                  handleMeritClose={this.props.handleMeritClose}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              )}
              <FloatingActionButton className="fixed-button active-merit" onClick={this.props.handleMeritOpen}>
                <i className="icon-pencil"></i>
              </FloatingActionButton>
            </Fragment>
          )}
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
