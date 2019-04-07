// @flow

import { isMobile, loadFirebase } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader, MeritRow } from 'components';
import type { Merit } from 'api/models';

import React, { Fragment, PureComponent} from 'react';
import { List } from 'material-ui/List';

type State = {
  loaded: boolean,
  allMerits: ?Array<Merit>,
  reverse: boolean
};

export class AllMeritsList extends PureComponent<Props, State> {
  state = {
    loaded: false,
    allMerits: null,
    reverse: false
  }

  componentDidMount() {
    if (!navigator.onLine) {
      this.setState({ loaded: true });
      return
    }
    loadFirebase('database')
    .then(() => {
      const { firebase } = window;
      const meritsRef = firebase.database().ref('/merits');

      meritsRef.limitToLast(100).on('value', (merits) => {
        if (!merits.val()) {
          this.setState({ loaded: true });
          return
        }
        // Retrieves the 100 most recent merits
        const allMerits = Object.keys(merits.val()).map(function(key) {
          return merits.val()[key];
        }).reverse();

        localStorage.setItem('allMerits', JSON.stringify(allMerits));
        this.setState({ allMerits, loaded: true });
      });
    });
  }

  componentWillUnmount() {
    const { firebase } = window;
    const meritsRef = firebase.database().ref('/merits');
    meritsRef.off('value');
  }

  shortenedName(name: string): string {
    const lastIndex = name.lastIndexOf(' ');
    const firstName = name.substr(0, lastIndex);
    const lastName = name.substr(lastIndex + 1)[0];
    return `${firstName} ${lastName}.`;
  }

  reverse = () => {
    const { allMerits, reverse } = this.state;
    const reversedMerits = allMerits && allMerits.reverse();
    this.setState({ allMerits: reversedMerits, reverse: !reverse });
  }

  render() {
    const { allMerits, reverse } = this.state;

    if (!this.state.loaded) {
      return <LoadingComponent />;
    }

    return (
      <Fragment>
        <List className="animate-in garnett-list">
          <FilterHeader isReversed={reverse} reverse={this.reverse} />
          {allMerits && allMerits.map((merit, i) => (
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
          ))}
        </List>
      </Fragment>
    )
  }
}
