// @flow

import '../../MyMerits/MyMerits.css';
import API from 'api/API.js';
import { MeritDialogList } from 'components/MeritDialogList';
import type { User } from 'api/models';

import React, { Component, type Node } from 'react';
import Chip from 'material-ui/Chip';

type Props = {
  state: User,
  setUsers: (Array<User>) => void,
  setDescription: (string) => void
};

type State = {
  users: Array<User>,
  selectedUsers: Array<Object>,
  name: string,
  description: string,
  showAlumni: boolean
};

export class SelectUsers extends Component<Props, State> {
  state = {
    users: [],
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

  updateValue = (label: string, value: string) => {
    this.setState({ [label]: value });
  }

  onNameKeyDown = (event: SyntheticEvent<>) => {
    // Remove last selected active if no name input exists
    if ((event.keyCode === 8 || event.keyCode === 46) && !this.state.name) {
      const { selectedUsers } = this.state;
      selectedUsers.pop();
      this.setState({ selectedUsers });
    }
  }

  selectUser = (user: User) => {
    const userName = `${user.firstName} ${user.lastName}`;
    // Only allow selection if active has enough merits
    if (this.props.amount <= user.remainingMerits) {
      const { selectedUsers } = this.state;
      selectedUsers.push({
        firstName: user.firstName,
        value: user.firstName + user.lastName,
        label: userName
      });
      this.setState({ selectedUsers, name: '' });
    } else {
      this.props.handleRequestOpen(`Not enough merits for ${userName}.`)
    }
  }

  selectAllPledges = () => {
    if (this.props.state.status === 'pledge') {
      return;
    }
    const selectedUsers = [];
    this.state.users.forEach((user) => {
      const userName = `${user.firstName} ${user.lastName}`;
      selectedUsers.push({
        firstName: user.firstName,
        value: user.firstName + user.lastName,
        label: userName
      });
    })
    this.setState({ selectedUsers });
  }

  deselectUser = (user: User) => {
    let { selectedUsers } = this.state;
    selectedUsers = selectedUsers.filter((currentUser) => {
      return currentUser !== user;
    })
    this.setState({ selectedUsers });
  }

  toggleAlumniView = () => {
    const { displayName } = this.props.state;
    const { showAlumni } = this.state;
    API.getActivesForMeritMobile(displayName, !showAlumni)
    .then((res) => {
      const users = res.data;
      this.setState({
        users,
        selectedUsers: [],
        showAlumni: !showAlumni
      });
    });
  }

  render() {
    const isPledge = this.props.state.status === 'pledge';
    return (
      <div id="merit-select-users-container">
        <MeritDialogList
          users={this.state.users}
          selectedUsers={this.state.selectedUsers}
          name={this.state.name}
          showAlumni={isPledge && this.state.showAlumni}
          selectUser={this.selectUser}
          toggleAlumniView={this.toggleAlumniView}
        />
      </div>
    )
  }
}
