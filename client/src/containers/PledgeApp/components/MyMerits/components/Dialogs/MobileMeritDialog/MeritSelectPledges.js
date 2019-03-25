// @flow

import '../../../MyMerits.css';
import { getDate } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import API from 'api/API.js';
import { MeritUserRow } from './MeritUserRow';
import type { User } from 'api/models';

import React, { Component } from 'react';
import { List } from 'material-ui/List';
import Chip from 'material-ui/Chip';
import Subheader from 'material-ui/Subheader';

type Props = {
  state: User,
  amount: number,
  hidden: boolean,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  pledges: Array<User>,
  selectedPledges: Array<Object>,
  name: string,
  description: string,
  openSpinner: boolean
};

export class MeritSelectPledges extends Component<Props, State> {
  state = {
    pledges: [],
    selectedPledges: [],
    name: '',
    description: '',
    openSpinner: false
  };

  componentDidMount() {
    API.getPledgesForMeritMobile(this.props.state.displayName)
    .then((res) => {
      const pledges = res.data;
      this.setState({ pledges });
    });
  }

  get buttonDisabled(): boolean {
    return !this.state.selectedPledges.length || !this.state.description;
  }

  updateValue = (label: string, value: string) => {
    this.setState({ [label]: value });
  }

  onNameKeyDown = (event: SyntheticEvent<>) => {
    // Remove last selected pledge if no name input exists
    if ((event.keyCode === 8 || event.keyCode === 46) && !this.state.name) {
      let { selectedPledges } = this.state;
      selectedPledges.pop();
      this.setState({ selectedPledges });
    }
  }

  selectPledge = (pledge: User) => {
    const pledgeName = `${pledge.firstName} ${pledge.lastName}`;
    // Only allow selection if active has enough merits
    if (this.props.amount <= pledge.remainingMerits) {
      let { selectedPledges } = this.state;
      selectedPledges.push({
        firstName: pledge.firstName,
        value: pledge.firstName + pledge.lastName,
        label: pledgeName
      });
      this.setState({ selectedPledges, name: '' });
    } else {
      this.props.handleRequestOpen(`Not enough merits for ${pledgeName}.`)
    }
  }

  deselectPledge = (pledge: User) => {
    let { selectedPledges } = this.state;
    selectedPledges = selectedPledges.filter((currentPledge) => {
      return currentPledge !== pledge;
    })
    this.setState({ selectedPledges });
  }

  merit = () => {
    const {
      displayName,
      name: activeName,
      photoURL: activePhoto,
      status
    } = this.props.state;
    const { selectedPledges, description } = this.state;
    const { amount } = this.props;
    const date = getDate();
    let action = 'Merited';

    if (amount < 0) {
      action = 'Demerited';
    }

    const merit = {
      createdBy: displayName,
      activeName,
      description,
      amount,
      activePhoto,
      date,
      isPCGreet: false
    };

    this.openProgressDialog();

    API.meritAsActive(displayName, selectedPledges, merit, false, false, status)
    .then(res => {
      this.props.handleClose();
      this.closeProgressDialog();

      API.sendActiveMeritNotification(activeName, selectedPledges, amount)
      .then(res => {
        this.props.handleRequestOpen(`${action} pledges: ${amount} merits`);
      })
      .catch(error => console.log(`Error: ${error}`));
    })
    .catch((error) => {
      console.log(error)
      const pledge = error.response.data;

      console.log(`Not enough merits for ${pledge}`);
      this.props.handleClose();
      this.closeProgressDialog();
      this.props.handleRequestOpen(`Not enough merits for ${pledge}`);
    });
  }

  openProgressDialog = () => {
    this.setState({
      openSpinner: true,
      spinnerMessage: 'Meriting pledges...'
    });
  }

  closeProgressDialog = () => {
    this.setState({ openSpinner: false });
  }

  render() {
    return (
      <div
        className={this.props.hidden ? 'hidden' : ''}
        id="merit-select-users-container"
      >
        <div id="merit-inputs-container">
          <div className="merit-input">
            <div id="chips-container">
              {this.state.selectedPledges.map((pledge, i) => (
                <Chip
                  key={i}
                  className="garnett-chip merit-select"
                  onClick={() => this.deselectPledge(pledge)}
                  onRequestDelete={() => this.deselectPledge(pledge)}
                >
                  {pledge.firstName}
                </Chip>
              ))}
            </div>
            <input
              id="merit-users"
              type="text"
              placeholder="Name"
              onChange={(event) => this.updateValue('name', event.target.value)}
              onKeyDown={this.onNameKeyDown}
              value={this.state.name}
            />
          </div>
          <input
            className="merit-input"
            type="text"
            placeholder="Description"
            onChange={(event) => this.updateValue('description', event.target.value)}
            value={this.state.description}
          />
        </div>
        <List className="garnett-list merit-select">
          <Subheader className="garnett-subheader merit-select">Pledges</Subheader>
          {this.state.pledges.map((pledge, i) => {
            const pledgeName = pledge.firstName.toLowerCase();
            const searchedName = this.state.name.toLowerCase();
            const includesPledge = this.state.selectedPledges.find((selectedPledge) => {
              return selectedPledge.firstName === pledge.firstName
            })
            if (includesPledge || !pledgeName.startsWith(searchedName)) {
              return null;
            }
            else {
              return (
                <MeritUserRow
                  key={i}
                  user={pledge}
                  selectUser={() => this.selectPledge(pledge)}
                />
              )
            }
          })}
        </List>
        <button
          className="mobile-merit-button confirm"
          onClick={this.merit}
          disabled={this.buttonDisabled}
        >
          {this.props.amount < 0 ? 'Demerit' : 'Merit'}
        </button>
        <SpinnerDialog
          open={this.state.openSpinner}
          message={this.state.spinnerMessage}
        />
      </div>
    )
  }
}
