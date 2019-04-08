// @flow

import '../../../MyMerits.css';
import { getDate } from 'helpers/functions.js';
import { SpinnerDialog } from 'helpers/loaders.js';
import API from 'api/API.js';
import { MeritUserRow } from './MeritUserRow';
import { FilterHeader } from 'components';
import type { User } from 'api/models';

import React, { Component } from 'react';
import { List } from 'material-ui/List';
import Chip from 'material-ui/Chip';

type Props = {
  state: User,
  amount: number,
  hidden: boolean,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  actives: Array<User>,
  selectedActives: Array<Object>,
  name: string,
  description: string,
  showAlumni: boolean,
  openSpinner: boolean
};

export class MeritSelectActives extends Component<Props, State> {
  state = {
    actives: [],
    selectedActives: [],
    name: '',
    description: '',
    showAlumni: false,
    openSpinner: false
  }

  componentDidMount() {
    API.getActivesForMeritMobile(this.props.state.displayName)
    .then((res) => {
      const actives = res.data;
      this.setState({ actives });
    });
  }

  get buttonDisabled(): boolean {
    return !this.state.selectedActives.length || !this.state.description;
  }

  updateValue = (label: string, value: string) => {
    this.setState({ [label]: value });
  }

  onNameKeyDown = (event: SyntheticEvent<>) => {
    // Remove last selected active if no name input exists
    if ((event.keyCode === 8 || event.keyCode === 46) && !this.state.name) {
      let { selectedActives } = this.state;
      selectedActives.pop();
      this.setState({ selectedActives });
    }
  }

  selectActive = (active: User) => {
    const activeName = `${active.firstName} ${active.lastName}`;
    // Only allow selection if active has enough merits
    if (this.props.amount <= active.remainingMerits) {
      let { selectedActives } = this.state;
      selectedActives.push({
        firstName: active.firstName,
        value: active.firstName + active.lastName,
        label: activeName
      });
      this.setState({ selectedActives, name: '' });
    } else {
      this.props.handleRequestOpen(`Not enough merits for ${activeName}.`)
    }
  }

  deselectActive = (active: User) => {
    let { selectedActives } = this.state;
    selectedActives = selectedActives.filter((currentActive) => {
      return currentActive !== active;
    })
    this.setState({ selectedActives });
  }

  toggleAlumniView = () => {
    const { displayName } = this.props.state;
    const { showAlumni } = this.state;
    API.getActivesForMeritMobile(displayName, !showAlumni)
    .then((res) => {
      const actives = res.data;
      this.setState({
        actives,
        selectedActives: [],
        showAlumni: !showAlumni
      });
    });
  }

  merit = () => {
    const {
      displayName,
      name: pledgeName,
      photoURL: pledgePhoto
    } = this.props.state;
    const { selectedActives, description } = this.state;
    const { amount } = this.props;
    const date = getDate();
    let action = 'Merited';

    if (amount < 0) {
      action = 'Demerited';
    }

    const merit = {
      createdBy: displayName,
      pledgeName,
      description,
      amount,
      pledgePhoto,
      date,
      isPCGreet: false
    };

    const meritInfo = {
      displayName,
      selectedActives,
      merit,
      isChalkboard: false,
      isPCGreet: false
    };

    this.openProgressDialog();

    API.meritAsPledge(meritInfo)
    .then(res => {
      const totalAmount = amount * selectedActives.length;
      console.log(res);
      this.props.handleClose();
      this.closeProgressDialog();

      API.sendPledgeMeritNotification(pledgeName, selectedActives, amount)
      .then(res => {
        this.props.handleRequestOpen(`${action} yourself ${totalAmount} merits`);
      })
      .catch(error => console.log(`Error: ${error}`));
    })
    .catch((error) => {
      const active = error.response.data;
      console.log(error)
      console.log(`Not enough merits for ${active}`);
      this.props.handleClose();
      this.closeProgressDialog();
      this.props.handleRequestOpen(`${active} does not have enough merits`);
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
    return (
      <div
        className={this.props.hidden ? 'hidden' : ''}
        id="merit-select-users-container"
      >
        <div id="merit-inputs-container">
          <div className="merit-input">
            <div id="chips-container">
              {this.state.selectedActives.map((active, i) => (
                <Chip
                  key={i}
                  className="garnett-chip merit-select"
                  onClick={() => this.deselectActive(active)}
                  onRequestDelete={() => this.deselectActive(active)}
                >
                  {active.firstName}
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
        <FilterHeader
          title={this.state.showAlumni ? 'Alumni' : 'Actives'}
          filterName={this.state.showAlumni ? 'Actives' : 'Alumni'}
          openPopover={this.toggleAlumniView}
        />
        <List className="garnett-list merit-select">
          {this.state.actives.map((active, i) => {
            const activeName = active.firstName.toLowerCase();
            const searchedName = this.state.name.toLowerCase();
            const includesActive = this.state.selectedActives.find((selectedActive) => {
              return selectedActive.firstName === active.firstName;
            });
            
            if (includesActive || !activeName.startsWith(searchedName)) {
              return null;
            }
            else {
              return (
                <MeritUserRow
                  key={i}
                  user={active}
                  selectUser={() => this.selectActive(active)}
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
