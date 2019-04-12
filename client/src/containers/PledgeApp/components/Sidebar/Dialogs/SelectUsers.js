// @flow

import API from 'api/API.js';
import { getToday, formatDate } from 'helpers/functions';
import { MeritDialogList, SelectedUsersChips } from 'components';
import type { User, MeritType } from 'api/models';

import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const PLEDGING_START_DATE = new Date();
const PLEDGING_END_DATE = new Date();
PLEDGING_START_DATE.setMonth(3);
PLEDGING_END_DATE.setMonth(4);

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
  }

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

  setName = (event: SyntheticEvent<>) => {
    const name = event.target.value;
    const { filteredUsers } = this.state;
    let result = [];

    if (name === '') {
      result = this.state.users;
    } else {
      filteredUsers.forEach((user) => {
        const userName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const searchedName = name.toLowerCase();
        if (userName.startsWith(searchedName)) {
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
    // Remove last selected active if no name input exists
    if ((event.keyCode === 8 || event.keyCode === 46) && !this.state.name) {
      const { filteredUsers, selectedUsers } = this.state;
      const removedUser = selectedUsers.pop();
      filteredUsers.push(removedUser);
      this.props.setUsers(selectedUsers);
      this.setState({ filteredUsers, selectedUsers });
    }
  }

  handleDateChange = (date: Date) => {
    this.props.setDate(formatDate(date));
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
    this.setState({ users: null });

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
    const { filteredUsers, selectedUsers, name, showAlumni } = this.state;
    const isPledge = status === 'pledge';
    return (
      <div id="merit-select-users-container">
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
              autoComplete="off"
              value={this.state.name}
              onChange={this.setName}
              onKeyDown={this.onNameKeyDown}
            />
            {!isPledge && selectedUsers.length === 0 && !name && (
              <span id="select-all-pledges" onClick={this.selectAllPledges}>
                Select all pledges
              </span>
            )}
          </div>
          <input
            className="select-users-input"
            type="text"
            placeholder="Description"
            autoComplete="off"
            value={this.state.description}
            disabled={this.props.type === 'standardized'}
            onChange={this.setDescription}
          />
          <DayPickerInput
            value={this.state.date}
            formatDate={formatDate}
            placeholder={getToday()}
            onDayChange={this.handleDateChange}
            dayPickerProps={{
              selectedDays: this.state.date,
              fromMonth: PLEDGING_START_DATE,
              toMonth: PLEDGING_END_DATE
            }}
          />
        </div>
        <div
          id="darth-fader"
          className={`${selectedUsers.length > 0 ? 'selected-users' : ''}`}
        />
        <div id="merit-dialog-list-container">
          <MeritDialogList
            users={filteredUsers}
            selectedUsers={selectedUsers}
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
