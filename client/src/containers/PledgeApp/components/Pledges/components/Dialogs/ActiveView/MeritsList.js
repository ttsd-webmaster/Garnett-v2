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
        const { merits } = res.data;
        this.setState({ merits, loaded: true });
      })
      .catch(err => console.log('err', err));
    } else {
      this.props.handleRequestOpen('You are offline');
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
    const { merits, reverse, loaded } = this.state;

    if (!loaded) {
      return (
        <div className="loading-merits">
          <CircularProgress color="var(--accent-color)" size={30} />
        </div>
      )
    }

    if (!merits) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found dialog">No merits found</h1>
        </div>
      )
    }

    return (
      <List className="garnett-list dialog pledge">
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
