// @flow

import API from 'api/API.js';
import { setRefresh } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders';
import { PointRow } from './PointRow';
import type { User, ActivePoint } from 'api/models';

import React, { Fragment, PureComponent, type Node } from 'react';
import { List } from 'material-ui/List';
import CountUp from 'react-countup';

type Props = {
  state: User,
  handleRequestOpen: (string) => void
};

type State = {
  total: ?number,
  previousTotal: number,
  points: ?Array<ActivePoint>
};

export class MyPoints extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const points = JSON.parse(localStorage.getItem('myActivePoints'));
    const total = JSON.parse(localStorage.getItem('myActivePointsTotal'));
    this.state = {
      total,
      previousTotal: 0,
      points
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(this.fetchMyPoints);
      this.fetchMyPoints();
    }
  }

  get breakdown(): Node {
    const { points } = this.state;
    if (!points || points.length === 0) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found">No points earned yet</h1>
        </div>
      )
    }
    return (
      <List id="my-points-list" className="animate-in garnett-list">
        {points.map((point, i) => (
          point && <PointRow key={i} point={point} />
        ))}
      </List>
    )
  }

  fetchMyPoints = () => {
    const { displayName } = this.props.state;

    API.getMyPoints(displayName)
    .then((res) => {
      const { total, points } = res.data;
      localStorage.setItem('myActivePoints', JSON.stringify(points));
      localStorage.setItem('myActivePointsTotal', JSON.stringify(total));
      this.setState({
        total,
        previousTotal: this.state.total || 0,
        points
      });
    })
    .catch((error) => {
      console.error(error);
      this.props.handleRequestOpen('Could not load your points.');
    });
  }

  render() {
    const { total, previousTotal } = this.state;

    if (total === null || total === undefined) {
      return <LoadingComponent />
    }

    return (
      <Fragment>
        <div id="my-points-total">
          <CountUp
            className="total-points"
            start={previousTotal}
            end={total}
            useEasing
          />
          <h4 className="total-points-label">points earned</h4>
        </div>
        { this.breakdown }
      </Fragment>
    )
  }
}
