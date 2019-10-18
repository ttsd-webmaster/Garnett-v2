// @flow

import API from 'api/API.js';
import { FilterHeader, MeritRow } from 'components';
import type { Merit } from 'api/models';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

type Props = {
  pledgeName: string
};

type State = {
  merits: ?Array<Merit>,
  reverse: boolean
};

export class MeritsList extends PureComponent<Props, State> {
  state = {
    merits: null,
    reverse: false
  };

  componentDidMount() {
    const { pledgeName } = this.props;
    if (navigator.onLine) {
      API.getPledgeMerits(pledgeName)
      .then(res => {
        const { merits } = res.data;
        localStorage.setItem(`${pledgeName}Merits`, JSON.stringify(merits));
        this.setState({ merits });
      })
      .catch(err => console.log('err', err));
    } else {
      const merits = JSON.parse(localStorage.getItem(`${pledgeName}Merits`));
      this.setState({ merits });
    }
  }

  reverse = () => {
    const { merits, reverse } = this.state;
    this.setState({
      merits: merits.reverse(),
      reverse: !reverse
    });
  }

  render() {
    const { merits, reverse } = this.state;

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
        <FilterHeader isReversed={reverse} reverse={this.reverse} />
        {merits.map((merit, i) => {
          if (!merit) {
            return null
          }
          return (
            <MeritRow
              key={i}
              merit={merit}
              photo={merit.activePhoto}
              name={merit.activeName}
            />
          )
        })}
      </List>
    )
  }
}
