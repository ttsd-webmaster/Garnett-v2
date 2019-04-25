// @flow

import API from 'api/API.js';
import { isMobile, setRefresh } from 'helpers/functions.js';
import { LoadingComponent, FetchingListSpinner } from 'helpers/loaders.js';
import { FilterHeader, MeritRow } from 'components';
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
  reverse: boolean
};

export class AllMeritsList extends PureComponent<Props, State> {
  state = {
    allMerits: null,
    lastKey: null,
    reverse: false
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(this.fetchMerits);

      API.getAllMerits()
      .then((res) => {
        const { fetchedMerits, lastKey } = res.data;
        localStorage.setItem('allMerits', JSON.stringify(fetchedMerits));
        this.setState({ allMerits: fetchedMerits, lastKey });
      })
      .catch((err) => console.error(err));
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

  get merits(): Node {
    const { allMerits } = this.state;
    if (allMerits.length === 0) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found">No merits found</h1>
        </div>
      )
    }
    return (
      <InfiniteScroll
        loadMore={this.fetchMerits}
        hasMore={true}
        loader={FetchingListSpinner}
        useWindow={false}
        getScrollParent={() => this.props.containerRef}
      >
        <List className="animate-in garnett-list">
          {allMerits.map((merit, i) => {
            if (!merit) {
              return null;
            }
            return (
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
                      {merit.amount > 0
                        ? " merited "
                        : " demerited "
                      }
                    </span>
                    {this.shortenedName(merit.pledgeName)}
                  </p>
                }
              />
            )
          })}
        </List>
      </InfiniteScroll>
    )
  }

  fetchMerits = () => {
    if (this.state.lastKey) {
      API.getAllMerits(this.state.lastKey)
      .then((res) => {
        const { fetchedMerits, lastKey } = res.data;
        const allMerits = this.state.allMerits.concat(fetchedMerits);
        this.setState({ allMerits, lastKey });
      })
      .catch((err) => console.error(err));
    }
  }

  reverse = () => {
    const { allMerits, reverse } = this.state;
    const reversedMerits = allMerits.reverse();
    this.setState({ allMerits: reversedMerits, reverse: !reverse });
  }

  render() {
    const { allMerits, reverse } = this.state;
    if (!allMerits) {
      return <LoadingComponent />;
    }
    return (
      <Fragment>
        <FilterHeader isReversed={reverse} reverse={this.reverse} />
        { this.merits }
      </Fragment>
    )
  }
}
