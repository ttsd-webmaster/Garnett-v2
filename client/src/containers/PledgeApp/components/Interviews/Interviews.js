// @flow

import API from 'api/API.js';
import { setRefresh } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders';
import { UserRow } from 'components';
import { Dialogs } from './Dialogs';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';
import Subheader from 'material-ui/Subheader';
import { List } from 'material-ui/List';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

type Props = {
  state: User,
  handleRequestOpen: () => void,
};

export class Interviews extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const completedInterviews = JSON.parse(localStorage.getItem('completedInterviews'));
    const incompleteInterviews = JSON.parse(localStorage.getItem('incompleteInterviews'));
    this.state = {
      completedInterviews,
      incompleteInterviews,
      open: false,
      user: null
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(this.fetchInterviewProgress);
      this.fetchInterviewProgress();
    }
  }

  fetchInterviewProgress = () => {
    const { firstName, lastName, status } = this.props.state;
    const fullName = `${firstName} ${lastName}`;
    API.getInterviewsProgress(fullName, status)
    .then(res => {
      const completedInterviews = res.data.completed;
      const incompleteInterviews = res.data.incomplete;
      localStorage.setItem('completedInterviews', JSON.stringify(completedInterviews));
      localStorage.setItem('incompleteInterviews', JSON.stringify(incompleteInterviews));
      this.setState({ completedInterviews, incompleteInterviews });
    })
    .catch(err => console.error(err));
  }

  completeInterview = (user: User) => {
    const { firstName, lastName, status } = this.props.state;
    const fullName = `${firstName} ${lastName}`;
    const selectedUserName = `${user.firstName} ${user.lastName}`;
    const activeName = status === 'pledge' ? selectedUserName : fullName;
    const pledgeName = status === 'pledge' ? fullName : selectedUserName;
    API.completeInterview(activeName, pledgeName)
    .then((res) => {
      this.fetchInterviewProgress();
    })
    .catch(err => console.error(err));
  }

  openOptions = (user: User) => this.setState({ user, open: true });

  closeOptions = () => this.setState({ open: false });

  render() {
    const { completedInterviews, incompleteInterviews, open, user } = this.state;

    if (!completedInterviews || !incompleteInterviews) {
      return <LoadingComponent />
    }

    const interviewsDone = completedInterviews.length;
    const interviewsLeft = interviewsDone + incompleteInterviews.length;
    const percent = (interviewsDone / interviewsLeft) * 100;

    return (
      <div className="content animate-in">
        <Subheader className="garnett-subheader">Progress</Subheader>
        <Progress
          percent={percent}
          theme={{
            active: {
              symbol: `${interviewsDone}/${interviewsLeft}`,
              color: 'var(--accent-color)'
            }
          }}
        />
        <Subheader className="garnett-subheader">Completed</Subheader>
        <List className="garnett-list">
          {completedInterviews.map((user, i) => (
            <UserRow
              key={i}
              user={user}
              handleOpen={() => this.openOptions(user)}
            />
          ))}
        </List>
        <Subheader className="garnett-subheader">Incomplete</Subheader>
        <List className="garnett-list">
          {incompleteInterviews.map((user, i) => (
            <UserRow
              key={i}
              user={user}
              handleOpen={() => this.completeInterview(user)}
            />
          ))}
        </List>
        <Dialogs
          open={open}
          state={this.props.state}
          user={user}
          fetchInterviewProgress={this.fetchInterviewProgress}
          handleClose={this.closeOptions}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      </div>
    )
  }
}
