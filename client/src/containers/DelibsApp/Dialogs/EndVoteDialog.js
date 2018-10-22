import {loadFirebase} from 'helpers/functions.js';
import API from 'api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export default class EndVoteDialog extends Component {
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
        const rusheeName = this.props.rushee.replace(/ /g,'');
        const { firebase } = window;
        const rusheeRef = firebase.database().ref('/rushees/' + rusheeName);

        rusheeRef.on('value', (snapshot) => {
          const totalVotes = snapshot.val().totalVotes;
          this.setState({ totalVotes });
        });
      });
    }
  }

  endVote = () => {
    const { rushee } = this.props;
    
    API.endVote()
    .then((res) => {
      console.log('Ended Vote');
      this.props.handleClose();
      this.props.handleRequestOpen(`Ended vote on ${rushee}`);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
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
