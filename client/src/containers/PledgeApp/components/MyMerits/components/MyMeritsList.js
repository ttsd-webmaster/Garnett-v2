// @flow

import { MERIT_FILTER_OPTIONS } from 'helpers/constants';
import { androidBackOpen, androidBackClose, setRefresh } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { Filter, FilterHeader, MeritRow } from 'components';
import { OptionsDialog } from 'components/OptionsDialog';
import { LoadableEditMeritDialog } from './Dialogs';
import type { User, Merit } from 'api/models';

import React, { Fragment, PureComponent, type Node } from 'react';
import { List } from 'material-ui/List';

type Props = {
  state: User,
  handleRequestOpen: () => void
};

type State = {
  myMerits: ?Array<Merit>,
  selectedMerit: ?Merit,
  isReversed: boolean,
  dialogView: 'edit' | 'delete' | null,
  openOptions: boolean,
  openEdit: boolean,
  filterName: 'Merit Date' | 'Created on Garnett',
  openPopover: boolean,
  anchorEl: ?HTMLDivElement
};

export class MyMeritsList extends PureComponent<Props, State> {
  state = {
    myMerits: null,
    selectedMerit: null,
    isReversed: false,
    dialogView: null,
    openOptions: false,
    openEdit: false,
    filterName: localStorage.getItem('meritsSort') || 'Merit Date',
    openPopover: false,
    anchorEl: null
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(null);
      this.fetchMerits();
    } else {
      const myMerits = JSON.parse(localStorage.getItem('myMerits'));
      this.setState({ myMerits });
    }
  }

  componentWillUnmount() {
    const { firebase } = window;
    if (navigator.onLine && firebase) {
      const meritsRef = firebase.database().ref('/merits');
      meritsRef.off('value');
    }
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
      <List id="my-merits-list" className="animate-in garnett-list">
        {myMerits.map((merit, i) => (
          merit && (
            <MeritRow
              key={i}
              merit={merit}
              photo={isPledge ? merit.activePhoto : merit.pledgePhoto}
              name={isPledge ? merit.activeName : merit.pledgeName}
              userCreated={state.displayName === merit.createdBy}
              handleOptionsOpen={this.handleOptionsOpen}
            />
          )
        ))}
      </List>
    )
  }

  get sortByDate() {
    return this.state.filterName === 'Merit Date';
  }

  fetchMerits = () => {
    const { firebase } = window;
    const { firstName, lastName, status } = this.props.state;
    const fullName = `${firstName} ${lastName}`;
    const meritsRef = firebase.database().ref('/merits');
    let queriedName = 'activeName';

    if (status === 'pledge') {
      queriedName = 'pledgeName';
    }

    meritsRef.off('value');

    meritsRef.orderByChild(queriedName).equalTo(fullName).on('value', (merits) => {
      let myMerits = [];
      if (merits.val()) {
        myMerits = Object.keys(merits.val()).map(function(key) {
          return merits.val()[key];
        }).reverse();
        if (this.sortByDate) {
          myMerits = myMerits.sort((a, b) => b.date - a.date);
        }
      }
      localStorage.setItem('myMerits', JSON.stringify(myMerits));
      this.setState({ myMerits });
    });
  }

  handleOptionsOpen = (selectedMerit: Merit) => {
    if (navigator.onLine) {
      const { displayName, status } = this.props.state;
      if (status === 'pledge' && (displayName !== selectedMerit.createdBy)) {
        this.props.handleRequestOpen('You can only edit merits you created.');
      } else {
        androidBackOpen(this.handleEditClose);
        this.setState({ selectedMerit, openOptions: true });
      }
    } else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleOptionsClose = () => {
    androidBackClose();
    this.setState({ selectedMerit: null, openOptions: false });
  }

  handleEditOpen = (dialogView: 'edit' | 'delete') => {
    if (navigator.onLine) {
      androidBackOpen(this.handleEditClose);
      this.setState({ dialogView, openOptions: false, openEdit: true });
    } else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  handleEditClose = () => {
    androidBackClose();
    this.setState({ selectedMerit: null, dialogView: null, openEdit: false });
  }

  reverse = () => {
    const { myMerits, isReversed } = this.state;
    const reversedMerits = myMerits.reverse();
    this.setState({ myMerits: reversedMerits, isReversed: !isReversed });
  }

  openPopover = (event: SyntheticEvent<>) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      openPopover: true,
      anchorEl: event.currentTarget
    });
  };

  closePopover = () => this.setState({ openPopover: false });

  setFilter = (filterName: string) => {
    localStorage.setItem('meritsSort', filterName);
    this.setState({
      filterName,
      isReversed: false,
      openPopover: false
    }, () => {
      this.fetchMerits();
    });
  }

  render() {
    const { state, handleRequestOpen } = this.props;
    const {
      myMerits,
      selectedMerit,
      isReversed,
      dialogView,
      openOptions,
      openEdit,
      filterName,
      openPopover,
      anchorEl
    } = this.state;
    const DIALOG_OPTIONS = [
      {
        header: 'Merit Options',
        choices: [
          {
            text: 'Edit Date',
            icon: 'icon-calendar-plus-o',
            onClick: () => this.handleEditOpen('edit')
          },
          {
            text: 'Delete Merit',
            icon: 'icon-trash-empty',
            onClick: () => this.handleEditOpen('delete')
          }
        ]
      }
    ];

    return (
      <Fragment>
        <FilterHeader
          openPopover={this.openPopover}
          isReversed={isReversed}
          reverse={this.reverse}
        />

        { myMerits ? this.merits : <LoadingComponent /> }
        <OptionsDialog
          open={openOptions}
          options={DIALOG_OPTIONS}
          handleClose={this.handleOptionsClose}
        />
        <LoadableEditMeritDialog
          open={openEdit}
          state={state}
          merit={selectedMerit}
          view={dialogView}
          handleClose={this.handleEditClose}
          handleRequestOpen={handleRequestOpen}
        />
        <Filter
          open={openPopover}
          anchorEl={anchorEl}
          filters={MERIT_FILTER_OPTIONS}
          filterName={filterName}
          closePopover={this.closePopover}
          setFilter={this.setFilter}
        />
      </Fragment>
    )
  }
}
