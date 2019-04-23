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
  interviews: ?Array<Merit>
};

export class InterviewsList extends PureComponent<Props, State> {
  state = {
    interviews: null
  };

  componentDidMount() {
    const { pledgeName } = this.props;
    if (navigator.onLine) {
      API.getPledgeCompletedInterviews(this.props.pledgeName)
      .then(res => {
        const interviews = res.data;
        localStorage.setItem(`${pledgeName}Interviews`, JSON.stringify(interviews));
        this.setState({ interviews });
      })
      .catch(err => console.log('err', err));
    } else {
      const interviews = JSON.parse(localStorage.getItem(`${pledgeName}Interviews`));
      this.setState({ interviews });
    }
  }

  reverse = () => {
    const { interviews, reverse } = this.state;
    this.setState({
      interviews: interviews.reverse(),
      reverse: !reverse
    });
  }

  render() {
    const { interviews, reverse } = this.state;

    if (!interviews) {
      return (
        <div className="loading-merits">
          <CircularProgress color="var(--accent-color)" size={30} />
        </div>
      )
    }

    if (interviews.length === 0) {
      return (
        <div className="no-items-container dialog">
          <h1 className="no-items-found dialog">No interviews found</h1>
        </div>
      )
    }

    return (
      <List className="garnett-list">
        <FilterHeader isReversed={reverse} reverse={this.reverse} />
        {interviews.map((interview, i) => {
          if (!interview) {
            return null
          }
          return (
            <MeritRow
              key={i}
              merit={interview}
              photo={interview.activePhoto}
              name={interview.activeName}
            />
          )
        })}
      </List>
    )
  }
}
