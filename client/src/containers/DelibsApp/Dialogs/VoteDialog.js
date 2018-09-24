import {loadFirebase} from '../../../helpers/functions.js';
import API from '../../../api/API.js';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

export default class VoteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      rushee: null
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const voteRef = firebase.database().ref('/delibsVoting');

        voteRef.on('value', (snapshot) => {
          const open = snapshot.val().open;
          const rushee = snapshot.val().rushee;

          this.setState({ open, rushee });
        });
      });
    }
  }

  handleChange = (e, value) => {
    const { displayName } = this.props.state;
    const { rushee } = this.state;

    API.voteForRushee(displayName, rushee, value)
    .then((res) => {
      console.log('Vote submitted');
      this.props.handleRequestOpen('Vote Submitted');
    })
    .catch((error) => {
      console.log('Error: ', error);
      this.props.handleRequestOpen('Error submitting vote');
    });
  }

  render() {
    return (
      <Dialog
        title={this.state.rushee}
        titleClassName="garnett-dialog-title"
        modal={true}
        bodyClassName="garnett-dialog-body delibs"
        contentClassName="garnett-dialog-content"
        open={this.state.open}
      >
        <RadioButtonGroup name="voting" onChange={this.handleChange}>
          <RadioButton
            className="delibs-radio-button"
            value="yes"
            label="Yes"
          />
          <RadioButton
            className="delibs-radio-button"
            value="abstain"
            label="Abstain"
          />
          <RadioButton
            className="delibs-radio-button"
            value="no"
            label="No"
          />
        </RadioButtonGroup>
      </Dialog>
    )
  }
}
