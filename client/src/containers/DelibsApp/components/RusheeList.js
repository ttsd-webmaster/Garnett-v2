// @flow

import '../DelibsApp.css';
import 'containers/PledgeApp/PledgeApp.css';
import { LoadingComponent } from 'helpers/loaders.js';
import { RusheeRow } from './RusheeRow';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

type Props = {
  history: RouterHistory,
  state: User
};

type State = {
  loaded: boolean,
  rushees: Array<Object>
};

export class RusheeList extends PureComponent<Props, State> {
  state = {
    loaded: false,
    rushees: [],
  }

  componentDidMount() {
    localStorage.setItem('route', 'delibs-app');
    
    if (navigator.onLine) {
      const { firebase } = window;
      const { displayName } = this.props.state;
      const rusheesRef = firebase.database().ref('/rushees');

      rusheesRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          const interactions = [];
          
          snapshot.forEach((rushee) => {
            rusheesRef.child(rushee.key + '/Actives/' + displayName).on('value', (active) => {
              interactions.push(active.val().interacted);
            })
          });

          const rushees = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          });

          rushees.forEach((rushee, i) => {
            rushee['interacted'] = interactions[i];
          });

          localStorage.setItem('rusheesArray', JSON.stringify(rushees));
          
          this.setState({
            rushees,
            loaded: true
          });
        } else {
          this.setState({ loaded: true });
        }
      });
    } else {
      this.setState({ loaded: true });
    }
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingComponent />
    }
    return (
      <div className="animate-in delibs-app">
        <Subheader className="garnett-subheader">Rushees</Subheader>
        <List className="garnett-list">
          {this.state.rushees.map((rushee) => (
            <RusheeRow
              rushee={rushee}
              state={this.props.state}
              history={this.props.history}
            />
          ))}
        </List>
      </div>
    )
  }
}