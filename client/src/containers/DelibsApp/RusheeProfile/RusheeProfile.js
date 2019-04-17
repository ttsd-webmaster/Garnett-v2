// @flow

import '../DelibsApp.css';
import 'containers/PledgeApp/PledgeApp.css';
import { LoadingRusheeProfile } from 'helpers/loaders.js';
import { Header } from 'components';
import { RusheeInfo } from './components/RusheeInfo';
import { RusheeProfileButton } from './components/RusheeProfileButton';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';

type Props = {
  history: RouterHistory,
  state: User
};

type State = {
  rushee: Object
};

export class RusheeProfile extends PureComponent<Props, State> {
  state = { rushee: null }

  componentDidMount() {
    const rusheeName = this.props.history.location.state;

    if (!rusheeName) {
      this.props.history.push('/delibs-app');
    }

    if (navigator.onLine) {
      const { firebase } = window;
      const rusheesRef = firebase.database().ref('/rushees/' + rusheeName);

      rusheesRef.on('value', (snapshot) => {
        this.setState({ rushee: snapshot.val() });
      });
    }
  }

  render() {
    if (!this.state.rushee) {
      return <LoadingRusheeProfile />
    }
    
    return (
      <div className="loading-container">
        <Header title="Rushee Profile" history={this.props.history} />
        <div className="animate-in delibs-app rushee">
          <img
            className={`user-photo${this.state.rushee.rotate ? " rotate" : ""}`}
            src={this.state.rushee.photo}
            alt="Rushee"
          />
          <RusheeInfo rushee={this.state.rushee} />
          <RusheeProfileButton
            state={this.props.state}
            rushee={this.state.rushee}
          />
        </div>
      </div>
    )
  }
}
