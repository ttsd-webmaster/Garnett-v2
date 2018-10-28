import '../DelibsApp.css';
import 'containers/PledgeApp/PledgeApp.css';
import { loadFirebase } from 'helpers/functions.js';
import { LoadingRusheeProfile } from 'helpers/loaders.js';
import { rusheeInfo} from './data.js';
import { RusheeProfileButton } from './components/RusheeProfileButton';

import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class RusheeProfile extends Component {
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
          <div className="app-header no-tabs">
            <span> Rushee Profile </span>
            <span
              className="back-button"
              onClick={this.props.history.goBack}
            > 
              Back 
            </span>
          </div>

          <div className="animate-in delibs-app rushee">
            {this.state.rushee.rotate ? (
              <img
                className="user-photo rotate"
                src={this.state.rushee.photo}
                alt="Rushee"
              />
            ) : (
              <img
                className="user-photo"
                src={this.state.rushee.photo}
                alt="Rushee"
              />
            )}

            <List className="garnett-list">
              {rusheeInfo.map((info, i) => (
                <div key={i}>
                  <Divider />
                  <ListItem
                    className="garnett-list-item rushee long"
                    primaryText={info.label}
                    secondaryText={this.state.rushee[info.value]}
                  />
                  <Divider />
                </div>
              ))}
            </List>

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
