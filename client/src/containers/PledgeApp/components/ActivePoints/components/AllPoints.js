// @flow

import API from 'api/API.js';
import { setRefresh } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders';
import { PointRow } from './PointRow';
import type { User, ActivePoint } from 'api/models';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';

type Props = {
  state: User,
  openBreakdown: (string) => void,
  handleRequestOpen: (string) => void
};

type State = {
  points: ?Array<ActivePoint>
};

// Every point award across all actives. Only rendered for point admins.
export class AllPoints extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const points = JSON.parse(localStorage.getItem('allActivePoints'));
    this.state = { points };
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(this.fetchAllPoints);
      this.fetchAllPoints();
    }
  }

  fetchAllPoints = () => {
    const { displayName } = this.props.state;

    API.getAllPoints(displayName)
    .then((res) => {
      const { points } = res.data;
      localStorage.setItem('allActivePoints', JSON.stringify(points));
      this.setState({ points });
    })
    .catch((error) => {
      console.error(error);
      this.props.handleRequestOpen('Could not load all points.');
    });
  }

  render() {
    const { openBreakdown } = this.props;
    const { points } = this.state;

    if (!points) {
      return <LoadingComponent />
    }

    if (points.length === 0) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found">No points awarded yet</h1>
        </div>
      )
    }

    return (
      <List id="all-points-list" className="animate-in garnett-list">
        {points.map((point) => (
          point && (
            <PointRow
              key={point.key}
              point={point}
              showRecipient
              handleOptionsOpen={() => openBreakdown(point.activeName)}
            />
          )
        ))}
      </List>
    )
  }
}
