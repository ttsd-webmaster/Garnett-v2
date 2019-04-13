// @flow

import API from 'api/API.js';
import { PLEDGING_START_DATE, PLEDGING_END_DATE } from 'helpers/constants';
import { getToday, formatDate } from 'helpers/functions';
import { MeritDialogList, SelectedUsersChips } from 'components';
import type { User, MeritType } from 'api/models';

import React, { Component, type Node } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

type Props = {
  state: User,
  type: MeritType,
  description: string,
  setUsers: (Array<User>) => void,
  setDescription: (string) => void,
  setDate: (string) => void,
  handleRequestOpen: () => void
};

type State = {
  users: ?Array<User>,
  filteredUsers: ?Array<Object>,
  selectedUsers: Array<Object>,
  name: string,
  description: string,
  date: Date,
  showAlumni: boolean
};

export class SelectUsers extends Component<Props, State> {
  state = {
    users: null,
    filteredUsers: null,
    selectedUsers: [],
    name: '',
    description: '',
    date: new Date(),
    showAlumni: false
  };

  componentDidMount() {
    const { status, displayName } = this.props.state;
    if (status === 'pledge') {
      API.getActivesForMeritMobile(displayName)
      .then((res) => {
        const users = res.data;
        this.setState({ users, filteredUsers: users });
      });
    } else {
      API.getPledgesForMeritMobile(displayName)
      .then((res) => {
        const users = res.data;
        this.setState({ users, filteredUsers: users });
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { description } = this.props;
    if (description !== prevProps.description) {
      this.props.setDescription(description);
      this.setState({ description });
    }
  }

  get header(): Node {
    const { status } = this.props.state;
    const { selectedUsers, name, description } = this.state;
    const isPledge = status === 'pledge';
    return (
      <div id="select-users-header">
        <SelectedUsersChips
          selectedUsers={selectedUsers}
          deselectUser={this.deselectUser}
        />
        <div id="select-name-container">
          <input
            className="select-users-input"
            type="text"
            placeholder="Name"
            value={this.state.name}
            onChange={this.setName}
            onKeyDown={this.onNameKeyDown}
          />
          {!isPledge && !name && (selectedUsers.length === 0) && (
            <span id="select-all-pledges" onClick={this.selectAllPledges}>
              Select all pledges
            </span>
          )}
        </div>
        <label htmlFor="description" className="select-users-input description">
          { this.props.type === 'chalkboard' && 'Chalkboard:\xa0' }
          <input
            id="description"
            type="text"
            placeholder="Description"
            value={description}
            disabled={this.props.type === 'standardized'}
            onChange={this.setDescription}
          />
        </label>
        <DayPickerInput
          value={this.state.date}
          formatDate={formatDate}
          placeholder={getToday()}
          onDayChange={this.setDate}
          inputProps={{ readOnly: true }}
          dayPickerProps={{
            selectedDays: this.state.date,
            fromMonth: PLEDGING_START_DATE,
            toMonth: PLEDGING_END_DATE,
            disabledDays: [{
              after: new Date(),
              before: PLEDGING_START_DATE
            }]
          }}
        />
        <div
          id="darth-fader"
          className={`${selectedUsers.length > 0 ? 'selected-users' : ''}`}
        />
      </div>
    )
  }

  setName = (event: SyntheticEvent<>) => {
    const name = event.target.value;
    const { users, filteredUsers } = this.state;
    let result = [];

    if (name === '') {
      result = users;
    } else {
      filteredUsers.forEach((user) => {
        const userName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (userName.startsWith(name.toLowerCase())) {
          result.push(user);
        }
      });
    }

    this.setState({ filteredUsers: result, name });
  }

  setDescription = (event: SyntheticEvent<>) => {
    const description = event.target.value;
    this.props.setDescription(description);
    this.setState({ description });
  }

  onNameKeyDown = (event: SyntheticEvent<>) => {
    const { filteredUsers, selectedUsers, name } = this.state;
    const { keyCode } = event;
    // Remove last selected active if no name input exists and
    // there are selected users
    if ((keyCode === 8 || keyCode === 46) && !name && selectedUsers.length > 0) {
      const removedUser = selectedUsers.pop();
      filteredUsers.push(removedUser);
      this.props.setUsers(selectedUsers);
      this.setState({ filteredUsers, selectedUsers });
    }
  }

  setDate = (date: Date) => {
    this.props.setDate(date);
    this.setState({ date });
  }

  selectUser = (user: User) => {
    let { filteredUsers, selectedUsers } = this.state;
    selectedUsers.push(user);
    filteredUsers = filteredUsers.filter((currentUser) => {
      const userDisplayName = user.firstName + user.lastName;
      const currentUserName = currentUser.firstName + currentUser.lastName;
      return userDisplayName !== currentUserName;
    });
    this.props.setUsers(selectedUsers);
    this.setState({ selectedUsers, filteredUsers });
  }

  selectAllPledges = () => {
    const { users } = this.state;
    if (this.props.state.status !== 'pledge' && users) {
      this.props.setUsers(users);
      this.setState({ selectedUsers: users, filteredUsers: [] });
    }
  }

  deselectUser = (user: User) => {
    let { filteredUsers, selectedUsers } = this.state;
    selectedUsers = selectedUsers.filter((currentUser) => {
      return currentUser !== user;
    })
    filteredUsers.push(user);
    this.props.setUsers(selectedUsers);
    this.setState({ filteredUsers, selectedUsers });
  }

  toggleAlumniView = () => {
    const { displayName } = this.props.state;
    const { showAlumni } = this.state;

    // Show spinner while loading users
    this.setState({ filteredUsers: null });

    API.getActivesForMeritMobile(displayName, !showAlumni)
    .then((res) => {
      const users = res.data;
      this.props.setUsers([]);
      this.setState({
        users,
        filteredUsers: users,
        selectedUsers: [],
        showAlumni: !showAlumni
      });
    });
  }

  render() {
    const { status } = this.props.state;
    const { filteredUsers, showAlumni } = this.state;
    const isPledge = status === 'pledge';
    return (
      <div id="merit-select-users-container">
        { this.header }
        <div id="merit-dialog-list-container">
          <MeritDialogList
            users={filteredUsers}
            isPledge={isPledge}
            showAlumni={isPledge && showAlumni}
            selectUser={this.selectUser}
            toggleAlumniView={this.toggleAlumniView}
          />
        </div>
      </div>
    )
  }
}
