// @flow

import { isMobile, loadFirebase } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader, MeritRow } from 'components';
import type { Merit } from 'api/models';

import React, { Fragment, PureComponent} from 'react';
import { List } from 'material-ui/List';

type Props = {
  hidden: boolean
};

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
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const meritsRef = firebase.database().ref('/merits');

        meritsRef.limitToLast(100).on('value', (merits) => {
          // Retrieves the 100 most recent merits
          const allMerits = Object.keys(merits.val()).map(function(key) {
            return merits.val()[key];
          }).reverse();

          localStorage.setItem('allMerits', JSON.stringify(allMerits));

          this.setState({ allMerits, loaded: true });
        });
      });
    } else {
      this.setState({ loaded: true });
    }
  }

  shortenedName(name: string): string {
    const lastIndex = name.lastIndexOf(' ');
    const firstName = name.substr(0, lastIndex);
    const lastName = name.substr(lastIndex + 1)[0];
    return `${firstName} ${lastName}.`;
  }

  reverse = () => this.setState({ reverse: !this.state.reverse });

  render() {
    let { allMerits, reverse } = this.state;

    if (this.props.hidden) {
      return null
    }

    if (!this.state.loaded) {
      return <LoadingComponent className={this.props.hidden ? "hidden" : ""} />;
    }

    if (allMerits && reverse) {
      allMerits = allMerits.slice().reverse();
    }

    return (
      <Fragment>
        <List className="animate-in garnett-list">
          <FilterHeader
            title={reverse ? "Oldest" : "Recent"}
            isReversed={reverse}
            reverse={this.reverse}
          />
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
