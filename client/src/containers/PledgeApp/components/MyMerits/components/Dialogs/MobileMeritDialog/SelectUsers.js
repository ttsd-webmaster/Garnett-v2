// @flow

import '../../../MyMerits.css';
import { getDate } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import API from 'api/API.js';
import { MeritDialogList } from 'components/MeritDialogList';
import type { User } from 'api/models';

import React, { Component, type Node } from 'react';
import Chip from 'material-ui/Chip';

type Props = {
  state: User,
  amount: number,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  users: Array<User>,
  selectedUsers: Array<Object>,
  name: string,
  description: string,
  showAlumni: boolean,
  openSpinner: boolean
};

export class SelectUsers extends Component<Props, State> {
  state = {
    users: [],
    selectedUsers: [],
    name: '',
    description: '',
    showAlumni: false,
    openSpinner: false
  };

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

  get inputs(): Node {
    const { status } = this.props.state;
    const { selectedUsers, name, description } = this.state;
    return (
      <div id="merit-inputs-container">
        <div className="merit-input">
          {selectedUsers.length > 0 && (
            <div className="chips-container select-users">
              {selectedUsers.map((user, i) => (
                <Chip
                  key={i}
                  className="garnett-chip merit-dialog active"
                  onClick={() => this.deselectUser(user)}
                  onRequestDelete={() => this.deselectUser(user)}
                >
                  { user.firstName }
                </Chip>
              ))}
            </div>
          )}
          <input
            className="merit-input name"
            type="text"
            placeholder="Name"
            onChange={(event) => this.updateValue('name', event.target.value)}
            onKeyDown={this.onNameKeyDown}
            value={name}
          />
          {status !== 'pledge' && selectedUsers.length === 0 && name.length === 0 && (
            <span className="select-all-pledges" onClick={this.selectAllPledges}>
              Select all pledges
            </span>
          )}
        </div>
        <input
          className="merit-input"
          type="text"
          placeholder="Description"
          onChange={(event) => this.updateValue('description', event.target.value)}
          value={description}
        />
      </div>
    )
  }

  get buttonDisabled(): boolean {
    return !this.state.selectedUsers.length || !this.state.description;
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

      API.sendPledgeMeritNotification(name, selectedUsers, amount)
      .then(res => {
        let message;
        if (status === 'pledge') {
          const totalAmount = amount * selectedUsers.length;
          message = `${action} yourself ${totalAmount} merits`
        } else {
          message = `${action} pledges: ${amount} merits`
        }
        this.props.handleRequestOpen(message);
      })
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
    this.setState({
      openSpinner: true,
      spinnerMessage: 'Meriting myself...'
    });
  }

  closeProgressDialog = () => {
    this.setState({ openSpinner: false });
  }

  render() {
    const isPledge = this.props.state.status === 'pledge';
    return (
      <div id="mobile-merit-select-users-container">
        { this.inputs }
        <MeritDialogList
          users={this.state.users}
          selectedUsers={this.state.selectedUsers}
          name={this.state.name}
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
