import {loadFirebase} from '../../helpers/functions.js';
import API from '../../api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export default class VoteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalVotes: null
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let totalVotes;
        let rusheeName = this.props.rushee.replace(/ /g,'');
        let firebase = window.firebase;
        let rusheeRef = firebase.database().ref('/rushees/' + rusheeName);

        rusheeRef.on('value', (snapshot) => {
          this.setState({
            totalVotes: snapshot.val().totalVotes
          });
        });
      });
    }
  }

  endVote = () => {
    let rushee = this.props.rushee;
    
    API.endVote()
    .then((res) => {
      console.log('Ended Vote');
      this.props.handleClose();
      this.props.handleRequestOpen(`Ended vote on ${rushee}`);
    })
    .catch((error) => {
      console.log('Error: ', error);
      this.props.handleClose();
      this.props.handleRequestOpen(`Error ending vote on ${rushee}`);
    });
  }

  render() {
    const actions = [
      <RaisedButton
        label="End"
        primary={true}
        onClick={this.endVote}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={true}
        open={this.props.open}
      >
        <p> Voting for {this.props.rushee} </p>
        <p> Total Votes: {this.state.totalVotes} </p>
      </Dialog>
    )
  }
}
