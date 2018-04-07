import './DelibsApp.css';
import '../PledgeApp/PledgeApp.css';
import '../../components/Settings/Settings.css';
import {loadFirebase} from '../../helpers/functions.js';
import {LoadingRusheeProfile} from '../../helpers/loaders.js';
import API from '../../api/API.js';
import {rusheeInfo} from './data.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Snackbar from 'material-ui/Snackbar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {BottomSheet} from '../../helpers/BottomSheet/index.js';

const LoadableEndVoteDialog = Loadable({
  loader: () => import('./Dialogs/EndVoteDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

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

const LoadableResumeDialog = Loadable({
  loader: () => import('./Dialogs/ResumeDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export default class RusheeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      rushee: null,
      sheetOpen: false,
      openResume: false,
      openSnackbar: false,
      message: ''
    };
  }

  componentWillMount() {
    let rusheeName = this.props.history.location.state;

    if (!this.props.history.location.state) {
      this.props.history.push('/delibs-app');
    }

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let rusheesRef = firebase.database().ref('/rushees/' + rusheeName);

        rusheesRef.on('value', (snapshot) => {
          this.setState({
            rushee: snapshot.val()
          });
        });
      });
    }
  }

  startVote = () => {
    let rusheeName = this.state.rushee.name;

    API.startVote(rusheeName)
    .then((res) => {
      console.log('Started Vote');
      this.setState({
        open: true
      });
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  viewResume = () => {
    // Handles android back button
    if (/android/i.test(navigator.userAgent)) {
      let path;
      if (process.env.NODE_ENV === 'development') {
        path = 'http://localhost:3000';
      }
      else {
        path = 'https://garnett-app.herokuapp.com';
      }

      window.history.pushState(null, null, path + window.location.pathname);
      window.onpopstate = () => {
        this.closeResume();
      }
    }

    this.setState({
      sheetOpen: false,
      openResume: true
    });
  }

  closeResume = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({
      openResume: false
    });
  }

  handleRequestOpen = (message) => {
    this.setState({
      openSnackbar: true,
      message: message
    });
  }

  handleRequestClose = () => {
    this.setState({
      openSnackbar: false
    });
  }

  render() {
    return (
      this.state.rushee ? (
        <div className="loading-container">
          <div className="app-header no-tabs">
            <span> Rushee Profile </span>
            <span className="back-home" onClick={this.props.history.goBack}> Back </span>
          </div>

          <div className="animate-in delibs-app rushee">
            <img className="user-photo" src={this.state.rushee.photo} alt="User" />
            <List className="garnett-list">
              {rusheeInfo.map((info, i) => (
                <div key={i}>
                  <Divider />
                  <ListItem
                    className="garnett-list-item rushee"
                    primaryText={info.label}
                    secondaryText={this.state.rushee[info.value]}
                  />
                  <Divider />
                </div>
              ))}
            </List>

            {this.props.state.status === 'regent' ? (
              <div>
                <div className="logout-button" onClick={this.startVote}> Start Vote </div>

                <LoadableEndVoteDialog
                  open={this.state.open}
                  rushee={this.state.rushee.name}
                  handleClose={this.handleClose}
                  handleRequestOpen={this.handleRequestOpen}
                />
              </div>
            ) : (
              <div>
                <BottomSheet
                  onRequestClose={() => this.setState({sheetOpen: false})}
                  open={this.state.sheetOpen}
                >
                  <Subheader> Open </Subheader>
                  <List>
                    <ListItem primaryText="Resume" onClick={this.viewResume} />
                    <ListItem primaryText="Cover Letter" onClick={this.viewResume} />
                    <ListItem primaryText="Schedule" onClick={this.viewResume} />
                    <ListItem primaryText="Pre-Delibs Sheet" onClick={this.viewResume} />
                  </List>
                </BottomSheet>

                <div 
                  className="logout-button"
                  onClick={() => this.setState({sheetOpen: true})}
                >
                  Resources 
                </div>
                
                <LoadableResumeDialog
                  open={this.state.openResume}
                  resume={this.state.rushee.resume}
                  handleClose={this.closeResume}
                />
                <LoadableVoteDialog
                  state={this.props.state}
                  handleRequestOpen={this.handleRequestOpen}
                />
              </div>
            )}
          </div>

          <Snackbar
            open={this.state.openSnackbar}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      ) : (
        <LoadingRusheeProfile />
      )
    )
  }
}
