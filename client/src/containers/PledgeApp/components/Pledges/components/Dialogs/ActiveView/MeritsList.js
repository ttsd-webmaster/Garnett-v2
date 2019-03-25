// @flow

import '../../../../MyMerits/MyMerits.css';
import './ActiveView.css';
import API from 'api/API.js';
import { FilterHeader, MeritRow } from 'components';
import type { Merit } from 'api/models';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

type Props = {
  pledgeName: string,
  handleRequestOpen: () => void
};

type State = {
  merits: ?Array<Merit>,
  reverse: boolean,
  loaded: boolean
};

export class MeritsList extends PureComponent<Props, State> {
  state = {
    merits: null,
    reverse: false,
    loaded: false
  };

  componentDidMount() {
    if (navigator.onLine) {
      API.getPledgeMerits(this.props.pledgeName)
      .then(res => {
        this.setState({
          merits: res.data,
          loaded: true
        });
      })
      .catch(err => console.log('err', err));
    } else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  reverse = () => this.setState({ reverse: !this.state.reverse });

  render() {
    let { merits, reverse, loaded } = this.state;

    if (merits && reverse) {
      merits = merits.slice().reverse();
    }

    if (!loaded) {
      return (
        <div className="loading-merits">
          <CircularProgress color="var(--accent-color)" size={30} />
        </div>
      )
    }

    return (
      <List className="garnett-list dialog pledge">
        <FilterHeader
          title={reverse ? 'Oldest' : 'Recent'}
          isReversed={reverse}
          reverse={this.reverse}
        />
        {merits && merits.map((merit, i) => (
          <MeritRow
            key={i}
            merit={merit}
            photo={merit.activePhoto}
            name={merit.activeName}
          />
        ))}
      </List>
    )
  }
}
