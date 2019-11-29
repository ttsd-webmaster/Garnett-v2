// @flow

import API from 'api/API.js';
import type { Merit } from 'api/models';
import { MERIT_FILTER_OPTIONS } from 'helpers/constants';
import { Filter, FilterHeader, MeritRow } from 'components';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

type Props = {
  pledgeName: string
};

type State = {
  merits: ?Array<Merit>,
  filterName: 'Merit Date' | 'Created on Garnett',
  isReversed: boolean,
  openPopover: boolean,
  anchorEl: ?HTMLDivElement
};

export class MeritsList extends PureComponent<Props, State> {
  state = {
    merits: null,
    filterName: localStorage.getItem('meritsSort') || 'Merit Date',
    isReversed: false,
    openPopover: false,
    anchorEl: null
  };

  componentDidMount() {
    const { pledgeName } = this.props;
    if (navigator.onLine) {
      this.fetchMerits();
    } else {
      const merits = JSON.parse(localStorage.getItem(`${pledgeName}Merits`));
      this.setState({ merits });
    }
  }

  get sortByDate() {
    return this.state.filterName === 'Merit Date';
  }

  fetchMerits = () => {
    const { pledgeName } = this.props;
    API.getPledgeMerits(pledgeName, this.sortByDate)
    .then(res => {
      const { merits } = res.data;
      localStorage.setItem(`${pledgeName}Merits`, JSON.stringify(merits));
      this.setState({ merits });
    })
    .catch(err => console.log('err', err));
  }

  reverse = () => {
    const { merits, isReversed } = this.state;
    this.setState({
      merits: merits.reverse(),
      isReversed: !isReversed
    });
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
      merits: null,
      filterName,
      isReversed: false,
      openPopover: false
    }, () => {
      this.fetchMerits();
    });
  }

  render() {
    const { merits, filterName, isReversed, openPopover, anchorEl } = this.state;

    if (!merits) {
      return (
        <div className="loading-merits">
          <CircularProgress color="var(--accent-color)" size={30} />
        </div>
      )
    }

    if (merits.length === 0) {
      return (
        <div className="no-items-container dialog">
          <h1 className="no-items-found dialog">No merits found</h1>
        </div>
      )
    }

    return (
      <List className="garnett-list">
        <FilterHeader
          filterName={filterName}
          openPopover={this.openPopover}
          isReversed={isReversed}
          reverse={this.reverse}
        />

        {merits.map((merit, i) => (
          merit && (
            <MeritRow
              key={i}
              merit={merit}
              photo={merit.activePhoto}
              name={merit.activeName}
            />
          )
        ))}

        <Filter
          open={openPopover}
          anchorEl={anchorEl}
          filters={MERIT_FILTER_OPTIONS}
          filterName={filterName}
          closePopover={this.closePopover}
          setFilter={this.setFilter}
        />
      </List>
    )
  }
}
