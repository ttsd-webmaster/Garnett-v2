import './DelibsApp.css';
import 'containers/PledgeApp/PledgeApp.css';
import {loadFirebase} from 'helpers/functions.js';
import {LoadingDelibsApp} from 'helpers/loaders.js';
import API from 'api/API.js';
import { LoadableVoteDialog } from './RusheeProfile/components/Dialogs';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

const labelStyle = {
  left: '-8px',
  width: 'auto'
};

export default class DelibsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      rushees: [],
    };
  }

  componentDidMount() {
    localStorage.setItem('route', 'delibs-app');
    
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const { displayName } = this.props.state;
        const rusheesRef = firebase.database().ref('/rushees');

        rusheesRef.on('value', (snapshot) => {
          if (snapshot.val()) {
            let interactions = [];
            
            snapshot.forEach((rushee) => {
              rusheesRef.child(rushee.key + '/Actives/' + displayName).on('value', (active) => {
                interactions.push(active.val().interacted);
              })
            });

            let rushees = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });

            rushees.forEach((rushee, i) => {
              rushee['interacted'] = interactions[i];
            });

            console.log(`Rushees array: ${rushees}`);

            localStorage.setItem('rusheesArray', JSON.stringify(rushees));
            
            this.setState({
              loaded: true,
              rushees
            });
          }
          else {
            this.setState({ loaded: true });
          }
        });
      });
    }
    else {
      this.setState({ loaded: true });
    }
  }

  goHome = () => {
    this.props.history.push('/home');
  }

  openRushee = (rushee) => {
    let rusheeName = rushee.name.replace(/ /g,'');

    this.props.history.push('/delibs-app/' + rusheeName, rusheeName);
  }

  updateInteraction = (rushee) => {
    let { displayName } = this.props.state;
    let rusheeName = rushee.name.replace(/ /g,'');
    let { interacted } = rushee;
    let { totalInteractions } = rushee;

    API.updateInteraction(displayName, rusheeName, interacted, totalInteractions)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
  }

  handleClickCapture(event) {
    event.stopPropagation();
  }

  interactedCheckbox = (rushee) => {
    return (
      <div className="checkbox-container" onClickCapture={this.handleClickCapture}>
        <Checkbox
          className="interactedCheckbox"
          label="Met"
          labelStyle={labelStyle}
          checked={rushee.interacted}
          onCheck={() => this.updateInteraction(rushee)}
        />
        <p className="interactedCount"> {rushee.totalInteractions} </p>
      </div>
    )
  }

  rusheeRow = (rushee) => {
    return (
      <div>
        <Divider className="garnett-divider large" inset={true} />
        <ListItem
          className="garnett-list-item large"
          leftAvatar={rushee.rotate ? (
            <Avatar size={70} src={rushee.photo} className="garnett-image large rotate" />
          ) : (
            <Avatar size={70} src={rushee.photo} className="garnett-image large" />
          )}
          primaryText={
            <p className="garnett-name"> {rushee.name} </p>
          }
          secondaryText={
            <p>
              {rushee.year}
              <br />
              {rushee.major}
            </p>
          }
          secondaryTextLines={2}
          onClick={() => this.openRushee(rushee)}
        >
          {this.interactedCheckbox(rushee)}
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    )
  }

  render() {
    return (
      this.state.loaded ? (
        <div className="loading-container">
          <div className="app-header no-tabs">
            <span> Delibs App </span>
            <span className="back-button" onClick={this.goHome}> Home </span>
          </div>

          <div className="animate-in delibs-app">
            <Subheader className="garnett-subheader"> Rushees </Subheader>
            <List className="garnett-list">
              {this.state.rushees.map((rushee, i) => (
                <LazyLoad
                  height={88}
                  offset={window.innerHeight}
                  once
                  key={i}
                  placeholder={
                    <div className="placeholder-skeleton">
                      <Divider className="garnett-divider large" inset={true} />
                      <div className="placeholder-avatar"></div>
                      <div className="placeholder-name"></div>
                      <div className="placeholder-year"></div>
                      <Divider className="garnett-divider large" inset={true} />
                    </div>
                  }
                >
                  {this.rusheeRow(rushee)}
                </LazyLoad>
              ))}
            </List>
          </div>

          {this.props.state.status !== 'regent' && (
            <LoadableVoteDialog
              state={this.props.state}
              handleRequestOpen={this.props.handleRequestOpen}
            />
          )}
        </div>
      ) : (
        <LoadingDelibsApp />
      )
    )
  }
}
