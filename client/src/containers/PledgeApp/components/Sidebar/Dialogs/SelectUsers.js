// @flow

import API from 'api/API.js';
import { MeritDialogList, SelectedUsersChips } from 'components';
import type { User, MeritType } from 'api/models';

import React, { Component } from 'react';

type Props = {
  state: User,
  type: MeritType,
  setUsers: (Array<User>) => void,
  setDescription: (string) => void,
  handleRequestOpen: () => void
};

type State = {
  users: ?Array<User>,
  selectedUsers: Array<Object>,
  name: string,
  description: string,
  showAlumni: boolean
};

export class SelectUsers extends Component<Props, State> {
  state = {
    users: null,
    selectedUsers: [],
    name: '',
    description: '',
    showAlumni: false
  }

  componentDidMount() {
    const { status, displayName } = this.props.state;
    if (status === 'pledge') {
      API.getActivesForMeritMobile(displayName)
      .then((res) => {
        const users = res.data;
        this.setState({ users });
      });
    } else {
      API.getPledgesForMeritMobile(displayName)
      .then((res) => {
        const users = res.data;
        this.setState({ users });
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { type } = this.props;
    if (type !== prevProps.type) {
      let description = '';
      switch (type) {
        case 'pc':
          description = 'PC Merits';
          break;
        case 'chalkboard':
          description = 'Chalkboard: ';
          break;
        default:
      }
      this.props.setDescription(description);
      this.setState({ description });
    }
  }

  updateValue = (label: string, value: string) => {
    if (label === 'description') {
      this.props.setDescription(value);
    }
    this.setState({ [label]: value });
  }

  onNameKeyDown = (event: SyntheticEvent<>) => {
    // Remove last selected active if no name input exists
    if ((event.keyCode === 8 || event.keyCode === 46) && !this.state.name) {
      const { selectedUsers } = this.state;
      selectedUsers.pop();
      this.props.setUsers(selectedUsers);
      this.setState({ selectedUsers });
    }
  }

  selectUser = (user: User) => {
    const userName = `${user.firstName} ${user.lastName}`;
    const { selectedUsers } = this.state;
    selectedUsers.push({
      firstName: user.firstName,
      value: user.firstName + user.lastName,
      label: userName
    });
    this.props.setUsers(selectedUsers);
    this.setState({ selectedUsers, name: '' });
  }

  selectAllPledges = () => {
    const { users } = this.state;
    if (this.props.state.status === 'pledge' || !users) {
      return;
    }
    const selectedUsers = [];
    users.forEach((user) => {
      const userName = `${user.firstName} ${user.lastName}`;
      selectedUsers.push({
        firstName: user.firstName,
        value: user.firstName + user.lastName,
        label: userName
      });
    })
    this.props.setUsers(selectedUsers);
    this.setState({ selectedUsers });
  }

  deselectUser = (user: User) => {
    let { selectedUsers } = this.state;
    selectedUsers = selectedUsers.filter((currentUser) => {
      return currentUser !== user;
    })
    this.props.setUsers(selectedUsers);
    this.setState({ selectedUsers });
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
        selectedUsers: [],
        showAlumni: !showAlumni
      });
    });
  }

  render() {
    const { status } = this.props.state;
    const { users, selectedUsers, name, showAlumni } = this.state;
    const isPledge = status === 'pledge';
    return (
      <div id="merit-select-users-container">
        <div id="select-users-header">
          <SelectedUsersChips
            selectedUsers={selectedUsers}
            deselectUser={this.deselectUser}
          />
          <input
            className="select-users-input"
            type="text"
            placeholder="Name"
            autoComplete="off"
            value={this.state.name}
            onChange={(event) => this.updateValue('name', event.target.value)}
            onKeyDown={this.onNameKeyDown}
          />
          {!isPledge && selectedUsers.length === 0 && !name && (
            <span id="select-all-pledges" onClick={this.selectAllPledges}>
              Select all pledges
            </span>
          )}
          <input
            className="select-users-input"
            type="text"
            placeholder="Description"
            autoComplete="off"
            value={this.state.description}
            disabled={this.props.type === 'pc'}
            onChange={(event) => this.updateValue('description', event.target.value)}
          />
        </div>
        <div
          id="darth-fader"
          className={`${selectedUsers.length > 0 ? 'selected-users' : ''}`}
        />
        <div id="merit-dialog-list-container">
          <MeritDialogList
            users={users}
            selectedUsers={selectedUsers}
            name={name}
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
