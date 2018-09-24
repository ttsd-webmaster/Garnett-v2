import './DelibsApp.css';
import '../PledgeApp/PledgeApp.css';
import '../../components/Settings/Settings.css';
import {loadFirebase} from '../../helpers/functions.js';
import {LoadingRusheeProfile} from '../../helpers/loaders.js';
import API from '../../api/API.js';
import {rusheeInfo} from './data.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
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

const LoadableResourceDialog = Loadable({
  loader: () => import('./Dialogs/ResourceDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

const LoadableInterviewDialog = Loadable({
  loader: () => import('./Dialogs/InterviewDialog'),
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
      openEndVote: false,
      rushee: null,
      resource: '',
      sheetOpen: false,
      openResource: false,
      openInterview: false
    };
  }

  componentWillMount() {
    const rusheeName = this.props.history.location.state;

    if (!this.props.history.location.state) {
      this.props.history.push('/delibs-app');
    }

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const rusheesRef = firebase.database().ref('/rushees/' + rusheeName);

        rusheesRef.on('value', (snapshot) => {
          const rushee = snapshot.val();

          this.setState({ rushee });
        });
      });
    }
  }

  startVote = () => {
    const rusheeName = this.state.rushee.name;

    API.startVote(rusheeName)
    .then((res) => {
      console.log('Started Vote');
      this.setState({ openEndVote: true });
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  }

  closeEndVote = () => {
    this.setState({ openEndVote: false });
  }

  viewResource = (resource) => {
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
        this.closeResource();
      }
    }

    this.setState({
      sheetOpen: false,
      openResource: true,
      resource
    });
  }

  closeResource = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({ openResource: false });
  }

  viewInterview = () => {
    let appBar = document.querySelector('.app-header');

    appBar.style.zIndex = 0;

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
        this.closeInterview();
      }
    }

    this.setState({
      sheetOpen: false,
      openInterview: true
    });
  }

  closeInterview = () => {
    let appBar = document.querySelector('.app-header');

    appBar.style.zIndex = 1;

    // Handles android back button
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }

    this.setState({ openInterview: false });
  }

  render() {
    return (
      this.state.rushee ? (
        <div className="loading-container">
          <div className="app-header no-tabs">
            <span> Rushee Profile </span>
            <span className="back-button" onClick={this.props.history.goBack}> Back </span>
          </div>

          <div className="animate-in delibs-app rushee">
            {this.state.rushee.rotate ? (
              <img className="user-photo rotate" src={this.state.rushee.photo} alt="Rushee" />
            ) : (
              <img className="user-photo" src={this.state.rushee.photo} alt="Rushee" />
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

            {this.props.state.status === 'regent' ? (
              <div>
                <div className="logout-button" onClick={this.startVote}> Start Vote </div>

                <LoadableEndVoteDialog
                  open={this.state.openEndVote}
                  rushee={this.state.rushee.name}
                  handleClose={this.closeEndVote}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              </div>
            ) : (
              <div>
                <BottomSheet
                  open={this.state.sheetOpen}
                  onRequestClose={() => this.setState({sheetOpen: false})}
                >
                  <Subheader> Open </Subheader>
                  <List>
                    <ListItem primaryText="Resume" onClick={() => this.viewResource('resume')} />
                    <ListItem primaryText="Degree Audit" onClick={() => this.viewResource('degreeAudit')} />
                    <ListItem primaryText="Schedule" onClick={() => this.viewResource('schedule')} />
                    <ListItem primaryText="Interview Responses" onClick={this.viewInterview} />
                    <a style={{textDecoration:'none'}} href={this.state.rushee.preDelibs} target="_blank">
                      <ListItem primaryText="Pre-Delibs Sheet"/>
                    </a>
                  </List>
                </BottomSheet>

                <div 
                  className="logout-button"
                  onClick={() => this.setState({sheetOpen: true})}
                >
                  Resources 
                </div>
                
                <LoadableResourceDialog
                  open={this.state.openResource}
                  resource={this.state.rushee.resources[this.state.resource]}
                  resourceName={this.state.resource}
                  handleClose={this.closeResource}
                />
                <LoadableInterviewDialog
                  open={this.state.openInterview}
                  rushee={this.state.rushee}
                  handleClose={this.closeInterview}
                />
                <LoadableVoteDialog
                  state={this.props.state}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <LoadingRusheeProfile />
      )
    )
  }
}
