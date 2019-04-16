// @flow

import { isMobile } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader, MeritRow } from 'components';
import type { Merit } from 'api/models';

import React, { Fragment, PureComponent, type Node } from 'react';
import { List } from 'material-ui/List';

type State = {
  allMerits: ?Array<Merit>,
  reverse: boolean
};

export class AllMeritsList extends PureComponent<Props, State> {
  state = {
    allMerits: null,
    reverse: false
  }

  componentDidMount() {
    if (navigator.onLine) {
      const { firebase } = window;
      const meritsRef = firebase.database().ref('/merits');
      meritsRef.orderByChild('date').on('value', (merits) => {
        let allMerits = [];
        if (merits.val()) {
          merits.forEach((merit) => {
            allMerits.push(merit.val());
          });
        }
        allMerits = allMerits.reverse();
        localStorage.setItem('allMerits', JSON.stringify(allMerits));
        this.setState({ allMerits });
      });
    } else {
      const allMerits = JSON.parse(localStorage.getItem('allMerits'));
      this.setState({ allMerits });
    }
  }

  componentWillUnmount() {
    const { firebase } = window;
    if (navigator.onLine && firebase) {
      const meritsRef = firebase.database().ref('/merits');
      meritsRef.off('value');
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
    )
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
