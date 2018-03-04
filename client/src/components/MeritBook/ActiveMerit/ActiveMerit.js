import '../MeritBook.css';
import {loadFirebase} from '../../../helpers/functions.js';
import {LoadingComponent} from '../../../helpers/loaders.js';
import API from '../../../api/API.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const LoadableActiveMeritDialog = Loadable({
  loader: () => import('./ActiveMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

const LoadableActiveMeritAllDialog = Loadable({
  loader: () => import('./ActiveMeritAllDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      pledgeArray: this.props.pledgeArray,
      open: false,
      openMeritAll: false,
      pledge: null,
      meritArray: [],
      remainingMerits: ''
    };
  }

  componentDidMount() {
    let pledgeArray = this.state.pledgeArray;

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let dbRef = firebase.database().ref('/users/');

        dbRef.on('value', (snapshot) => {
          pledgeArray = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          });
          pledgeArray = pledgeArray.filter(function(user) {
            return user.status === 'pledge';
          });

          console.log('Pledge array: ', pledgeArray);

          localStorage.setItem('pledgeArray', JSON.stringify(pledgeArray));
          
          this.setState({
            loaded: true,
            pledgeArray: pledgeArray
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

  componentDidUpdate() {
    let meritAll = document.getElementById('merit-all');

    if (meritAll) {
      if (this.props.index === 0) {
        meritAll.style.display = 'flex';
      }
      else {
        meritAll.style.display = 'none';
      }
    }
  }

  handleOpen = (pledge) => {
    let displayName = this.props.state.displayName;

    if (navigator.onLine) {
      API.getActiveMerits(displayName, pledge)
      .then(res => {
        this.setState({
          open: true,
          pledge: pledge,
          remainingMerits: res.data.remainingMerits,
          meritArray: res.data.meritArray
        });
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  handleMeritAllOpen = () => {
    if (navigator.onLine) {
      this.setState({
        openMeritAll: true
      });
    }
    else {
      this.handleRequestOpen('You are offline.');
    }
  }

  handleMeritAllClose = () => {
    this.setState({
      openMeritAll: false
    });
  }

  render() {
    return (
      this.state.loaded ? (
        <div className="animate-in">
          <List className="pledge-list">
            <Subheader> Pledges </Subheader>
            {this.state.pledgeArray.map((pledge, i) => (
              <div key={i}>
                <Divider className="pledge-divider large" inset={true} />
                <ListItem
                  className="pledge-list-item large"
                  leftAvatar={<Avatar className="pledge-image large" size={70} src={pledge.photoURL} />}
                  primaryText={
                    <p className="pledge-name"> {pledge.firstName} {pledge.lastName} </p>
                  }
                  secondaryText={
                    <p>
                      {pledge.year}
                      <br />
                      {pledge.major}
                    </p>
                  }
                  secondaryTextLines={2}
                  onClick={() => this.handleOpen(pledge)}
                >
                  <p className="pledge-merits"> {pledge.totalMerits} </p>
                </ListItem>
                <Divider className="pledge-divider large" inset={true} />
              </div>
            ))}
          </List>

          <div id="merit-all" className="fixed-button" onClick={this.handleMeritAllOpen}>
            <i className="icon-pencil"></i>
          </div>
          
          <LoadableActiveMeritDialog
            open={this.state.open}
            state={this.props.state}
            pledge={this.state.pledge}
            remainingMerits={this.state.remainingMerits}
            meritArray={this.state.meritArray}
            handleClose={this.handleClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />

          <LoadableActiveMeritAllDialog
            open={this.state.openMeritAll}
            state={this.props.state}
            handleMeritAllClose={this.handleMeritAllClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
