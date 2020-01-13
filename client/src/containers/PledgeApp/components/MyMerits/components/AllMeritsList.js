// @flow

import API from 'api/API.js';
import { MERIT_FILTER_OPTIONS } from 'helpers/constants';
import { isMobile, setRefresh } from 'helpers/functions.js';
import { LoadingComponent, FetchingListSpinner } from 'helpers/loaders.js';
import { Filter, FilterHeader, MeritRow } from 'components';
import type { Merit } from 'api/models';

import React, { Fragment, PureComponent, type Node } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { List } from 'material-ui/List';

type Props = {
  containerRef: ?HtmlDivElement
};

type State = {
  allMerits: ?Array<Merit>,
  lastKey: ?Object,
  isReversed: boolean,
  filterName: 'Merit Date' | 'Created on Garnett',
  openPopover: boolean,
  anchorEl: ?HTMLDivElement
};

export class AllMeritsList extends PureComponent<Props, State> {
  state = {
    allMerits: null,
    lastKey: null,
    hasMore: false,
    isReversed: false,
    filterName: localStorage.getItem('meritsSort') || 'Merit Date',
    openPopover: false,
    anchorEl: null
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(this.fetchInitialMerits);
      this.fetchInitialMerits();
    } else {
      const allMerits = JSON.parse(localStorage.getItem('allMerits'));
      this.setState({ allMerits });
    }
  }

  shortenedName(name: string): string {
    const lastIndex = name.lastIndexOf(' ');
    const firstName = name.substr(0, lastIndex);
    const lastName = name.substr(lastIndex + 1)[0];
    return `${firstName} ${lastName}.`;
  }

  get sortByDate() {
    return this.state.filterName === 'Merit Date';
  }

  get merits(): Node {
    const { allMerits, hasMore } = this.state;
    if (allMerits.length === 0) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found">No merits found</h1>
        </div>
      )
    }
    return (
      <InfiniteScroll
        loadMore={this.fetchMoreMerits}
        hasMore={hasMore}
        loader={FetchingListSpinner}
        useWindow={false}
        getScrollParent={() => this.props.containerRef}
      >
        <List className="animate-in garnett-list">
          {allMerits.map((merit, i) => (
            merit && (
              <MeritRow
                key={i}
                merit={merit}
                photo={merit.activePhoto}
                primaryText={
                  <p className="garnett-name all-merits">
                    {isMobile()
                      ? this.shortenedName(merit.activeName)
                      : merit.activeName}
                    <span style={{ fontWeight: 400 }}>
                      {merit.amount > 0 ? ' merited ' : ' demerited '}
                    </span>
                    {isMobile()
                      ? this.shortenedName(merit.pledgeName)
                      : merit.pledgeName}
                  </p>
                }
              />
            )
          ))}
        </List>
      </InfiniteScroll>
    )
  }

  fetchInitialMerits = () => {
    API.getAllMerits(this.sortByDate)
    .then((res) => {
      const { fetchedMerits, lastKey, hasMore } = res.data;
      localStorage.setItem('allMerits', JSON.stringify(fetchedMerits));
      this.setState({ allMerits: fetchedMerits, lastKey, hasMore });
    })
    .catch((err) => console.error(err));
  }

  fetchMoreMerits = () => {
    const { hasMore, isReversed } = this.state;

    if (hasMore) {
      if (isReversed) {
        API.getAllMeritsReverse(this.sortByDate, this.state.lastKey)
        .then((res) => {
          const { fetchedMerits, lastKey } = res.data;
          const allMerits = this.state.allMerits.concat(fetchedMerits);
          this.setState({ allMerits, lastKey });
        })
        .catch((err) => console.error(err));
      } else {
        API.getAllMerits(this.sortByDate, this.state.lastKey)
        .then((res) => {
          const { fetchedMerits, lastKey, hasMore } = res.data;
          const allMerits = this.state.allMerits.concat(fetchedMerits);
          this.setState({ allMerits, lastKey, hasMore });
        })
        .catch((err) => console.error(err));
      }
    }
  }

  reverse = () => {
    const isReversed = !this.state.isReversed;

    this.setState({ allMerits: null });

    if (isReversed) {
      API.getAllMeritsReverse(this.sortByDate)
      .then((res) => {
        const { fetchedMerits, lastKey } = res.data;
        localStorage.setItem('allMerits', JSON.stringify(fetchedMerits));
        this.setState({ allMerits: fetchedMerits, lastKey, isReversed });
      })
      .catch((err) => console.error(err));
    } else {
      this.fetchInitialMerits();
      this.setState({ isReversed });
    }
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
      allMerits: null,
      filterName,
      isReversed: false,
      openPopover: false
    }, () => {
      this.fetchInitialMerits();
    });
  }

  render() {
    const { allMerits, filterName, isReversed, openPopover, anchorEl } = this.state;

    return (
      <Fragment>
        <FilterHeader
          openPopover={this.openPopover}
          isReversed={isReversed}
          reverse={this.reverse}
        />

        {allMerits ? this.merits : <LoadingComponent /> }

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
