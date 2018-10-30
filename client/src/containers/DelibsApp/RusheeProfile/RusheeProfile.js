import '../DelibsApp.css';
import 'containers/PledgeApp/MobilePledgeApp.css';
import { loadFirebase } from 'helpers/functions.js';
import { LoadingRusheeProfile } from 'helpers/loaders.js';
import { Header } from 'components/Header';
import { RusheeInfo } from './components/RusheeInfo';
import { RusheeProfileButton } from './components/RusheeProfileButton';

import React, { PureComponent } from 'react';

export class RusheeProfile extends PureComponent {
  state = { rushee: null }

  componentDidMount() {
    const rusheeName = this.props.history.location.state;

    if (!rusheeName) {
      this.props.history.push('/delibs-app');
    }

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const rusheesRef = firebase.database().ref('/rushees/' + rusheeName);

        rusheesRef.on('value', (snapshot) => {
          this.setState({ rushee: snapshot.val() });
        });
      });
    }
  }

  render() {
    return (
      this.state.rushee ? (
        <div className="loading-container">
          <Header
            title="Rushee Profile"
            noTabs
            history={this.props.history}
          />
          <div className="animate-in delibs-app rushee">
            <img
              className={`user-photo ${this.state.rushee.rotate && "rotate"}`}
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
      ) : (
        <LoadingRusheeProfile />
      )
    )
  }
}
