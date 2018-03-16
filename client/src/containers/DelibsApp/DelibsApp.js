import './DelibsApp.css';
import '../PledgeApp/PledgeApp.css';
import {loadFirebase} from '../../helpers/functions.js';
import {LoadingDelibsApp, LoadingComponent} from '../../helpers/loaders.js';
import API from '../../api/API.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import LazyLoad from 'react-lazyload';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const LoadableVoteDialog = Loadable({
  loader: () => import('./VoteDialog'),
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

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let rushees;
        let firebase = window.firebase;
        let rusheesRef = firebase.database().ref('/rushees');

        rusheesRef.on('value', (snapshot) => {
          rushees = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          });
          rushees.sort((a, b) => {
            return a.lastName > b.lastName ? 1 : -1;
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
    this.props.history.goBack();
  }

  openRushee = (rushee) => {
    let rusheeName = rushee.firstName + rushee.lastName;
    let rusheeInfo = {
      name: `${rushee.firstName} ${rushee.lastName}`,
      email: rushee.email,
      year: rushee.year,
      major: rushee.major,
      graduationYear: rushee.graduationYear,
      phone: rushee.phone,
      photo: rushee.photo,
      resume: rushee.resume
    }

    this.props.history.push('/delibs-app/' + rusheeName, rusheeInfo);
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
          <div className="app-header">
            <span> Delibs App </span>
            <span className="back-home" onClick={this.goHome}> Home </span>
          </div>

          <List className="animate-in garnett-list delibs">
            <Subheader> Rushees </Subheader>
            {this.state.rushees.map((rushee, i) => (
              <LazyLoad
                height={88}
                offset={500}
                once
                unmountIfInvisible
                overflow
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
                      <p className="garnett-name"> {rushee.firstName} {rushee.lastName}</p>
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
                  />
                  <Divider className="garnett-divider large" inset={true} />
                </div>
              </LazyLoad>
            ))}
          </List>

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
        <div>
          <LoadingDelibsApp />
          <LoadingComponent />
        </div>
      )
    )
  }
}
