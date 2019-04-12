// @flow

import { getDate } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import API from 'api/API.js';
import { MeritDialogList, SelectedUsersChips } from 'components';
import type { User, MeritType } from 'api/models';

import React, { Component, type Node } from 'react';

type Props = {
  state: User,
  type: MeritType,
  amount: number,
  description: string,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  users: ?Array<User>,
  filteredUsers: ?Array<Object>,
  selectedUsers: Array<Object>,
  name: string,
  description: string,
  showAlumni: boolean,
  openSpinner: boolean,
  spinnerMessage: string
};

export class SelectUsers extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      filteredUsers: null,
      selectedUsers: [],
      name: '',
      description: this.props.description,
      showAlumni: false,
      openSpinner: false,
      spinnerMessage: ''
    };
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

  get inputs(): Node {
    const { status } = this.props.state;
    const { selectedUsers, name, description } = this.state;
    return (
      <div id="merit-inputs-container">
        <div className="merit-input">
          <SelectedUsersChips
            selectedUsers={selectedUsers}
            deselectUser={this.deselectUser}
          />
          <input
            className="merit-input name"
            type="text"
            placeholder="Name"
            onChange={this.setName}
            onKeyDown={this.onNameKeyDown}
            value={name}
          />
          {status !== 'pledge' && selectedUsers.length === 0 && name.length === 0 && (
            <span id="mobile-select-all-pledges" onClick={this.selectAllPledges}>
              Select all pledges
            </span>
          )}
        </div>
        <input
          className="merit-input"
          type="text"
          placeholder="Description"
          onChange={this.setDescription}
          value={description}
          disabled={this.props.type === 'standardized'}
        />
      </div>
    )
  }

  get buttonDisabled(): boolean {
    return !this.state.selectedUsers.length || !this.state.description;
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
    this.setState({ description });
  }

  onNameKeyDown = (event: SyntheticEvent<>) => {
    // Remove last selected active if no name input exists
    if ((event.keyCode === 8 || event.keyCode === 46) && !this.state.name) {
      const { filteredUsers, selectedUsers } = this.state;
      const removedUser = selectedUsers.pop();
      filteredUsers.push(removedUser);
      this.setState({ filteredUsers, selectedUsers });
    }
  }

  selectUser = (user: User) => {
    // Only allow selection if active has enough merits
    if (this.props.amount <= user.remainingMerits) {
      let { filteredUsers, selectedUsers } = this.state;
      selectedUsers.push(user);
      filteredUsers = filteredUsers.filter((currentUser) => {
        const userDisplayName = user.firstName + user.lastName;
        const currentUserName = currentUser.firstName + currentUser.lastName;
        return userDisplayName !== currentUserName;
      });
      this.setState({ selectedUsers, filteredUsers });
    } else {
      const userName = `${user.firstName} ${user.lastName}`;
      this.props.handleRequestOpen(`Not enough merits for ${userName}.`);
    }
  }

  selectAllPledges = () => {
    const { users } = this.state;
    if (this.props.state.status !== 'pledge' && users) {
      this.setState({ selectedUsers: users, filteredUsers: [] });
    }
  }

  deselectUser = (user: User) => {
    let { filteredUsers, selectedUsers } = this.state;
    selectedUsers = selectedUsers.filter((currentUser) => {
      return currentUser !== user;
    });
    filteredUsers.push(user);
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
        filteredUsers: users,
        selectedUsers: [],
        showAlumni: !showAlumni
      });
    });
  }

  merit = () => {
    const {
      displayName,
      name,
      photoURL,
      status
    } = this.props.state;
    const { selectedUsers, description } = this.state;
    const { type, amount } = this.props;
    const date = getDate();
    const action = amount > 0 ? 'Merited' : 'Demerited';

    const merit = {
      type,
      createdBy: displayName,
      description,
      amount,
      date
    };

    if (status === 'pledge') {
      merit.pledgeName = name;
      merit.pledgePhoto = photoURL;
    } else {
      merit.activeName = name;
      merit.activePhoto = photoURL;
    }

    const meritInfo = { displayName, selectedUsers, merit, status };

    this.openProgressDialog();

    API.createMerit(meritInfo)
    .then(res => {
      this.props.handleClose();
      this.closeProgressDialog();

      let message;
      if (status === 'pledge') {
        const totalAmount = amount * selectedUsers.length;
        message = `${action} yourself ${totalAmount} merits`;
      } else {
        message = `${action} pledges: ${amount} merits`;
      }
      this.props.handleRequestOpen(message);

      API.sendPledgeMeritNotification(name, selectedUsers, amount)
      .then(res => console.log(res))
      .catch(error => console.log(`Error: ${error}`));
    })
    .catch((error) => {
      const user = error.response.data;
      let errorMessage;
      if (status === 'pledge') {
        errorMessage = `${user} does not have enough merits`
      } else {
        errorMessage = `Not enough merits for ${user}`
      }
      console.error(error)
      this.props.handleClose();
      this.closeProgressDialog();
      this.props.handleRequestOpen(errorMessage);
    });
  }

  openProgressDialog = () => {
    const isPledge = this.props.state.status === 'pledge';
    const spinnerMessage = isPledge ? 'Meriting myself...' : 'Meriting pledges...';
    this.setState({ openSpinner: true, spinnerMessage });
  }

  closeProgressDialog = () => this.setState({ openSpinner: false });

  render() {
    const isPledge = this.props.state.status === 'pledge';
    return (
      <div id="mobile-merit-select-users-container">
        { this.inputs }
        <MeritDialogList
          users={this.state.filteredUsers}
          selectedUsers={this.state.selectedUsers}
          isPledge={isPledge}
          showAlumni={isPledge && this.state.showAlumni}
          selectUser={this.selectUser}
          toggleAlumniView={this.toggleAlumniView}
        />
        <div className="confirm-container">
          <button
            className="mobile-merit-button"
            onClick={this.merit}
            disabled={this.buttonDisabled}
          >
            {this.props.amount < 0 ? 'Demerit' : 'Merit'}
          </button>
        </div>
        <SpinnerDialog
          open={this.state.openSpinner}
          message={this.state.spinnerMessage}
        />
      </div>
    )
  }
}
