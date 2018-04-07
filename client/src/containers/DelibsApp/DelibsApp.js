import './DelibsApp.css';
import '../PledgeApp/PledgeApp.css';
import {loadFirebase} from '../../helpers/functions.js';
import {LoadingDelibsApp} from '../../helpers/loaders.js';
import API from '../../api/API.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import LazyLoad from 'react-lazyload';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

const labelStyle = {
  left: '-8px',
  width: 'auto'
};

const LoadableVoteDialog = Loadable({
  loader: () => import('./Dialogs/VoteDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export default class DelibsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      rushees: [],
      open: false,
      message: ''
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let displayName = this.props.state.displayName;
        let rusheesRef = firebase.database().ref('/rushees');

        rusheesRef.on('value', (snapshot) => {
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

          rushees.sort((rushee1, rushee2) => {
            let name1 = rushee1.name.split(" ").splice(-1);
            let name2 = rushee2.name.split(" ").splice(-1);
            return name1 > name2 ? 1 : -1;
          });

          console.log('Rushees array: ', rushees);

          localStorage.setItem('rusheesArray', JSON.stringify(rushees));
          
          this.setState({
            loaded: true,
            rushees: rushees
          });
        });
      });
    }
    else {
      this.setState({
        loaded: true
      });
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
    let displayName = this.props.state.displayName;
    let rusheeName = rushee.name.replace(/ /g,'');
    let interacted = rushee.interacted;
    let totalInteractions = rushee.totalInteractions;

    API.updateInteraction(displayName, rusheeName, interacted, totalInteractions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  }

  handleClickCapture(event) {
    event.stopPropagation();
  }

  handleRequestOpen = (message) => {
    this.setState({
      open: true,
      message: message
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      this.state.loaded ? (
        <div className="loading-container">
          <div className="app-header no-tabs">
            <span> Delibs App </span>
            <span className="back-home" onClick={this.goHome}> Home </span>
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
                  <div>
                    <Divider className="garnett-divider large" inset={true} />
                    <ListItem
                      className="garnett-list-item large"
                      leftAvatar={<Avatar size={70} src={rushee.photo} className="garnett-image large" />}
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
                    </ListItem>
                    <Divider className="garnett-divider large" inset={true} />
                  </div>
                </LazyLoad>
              ))}
            </List>
          </div>

          {this.props.state.status !== 'regent' && (
            <LoadableVoteDialog
              state={this.props.state}
              handleRequestOpen={this.handleRequestOpen}
            />
          )}

          <Snackbar
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      ) : (
        <LoadingDelibsApp />
      )
    )
  }
}
