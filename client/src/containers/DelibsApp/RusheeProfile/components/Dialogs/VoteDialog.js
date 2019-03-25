// @flow

import { loadFirebase } from 'helpers/functions.js';
import API from 'api/API.js';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';
import Dialog from 'material-ui/Dialog';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

type Props = {
  state: User,
  handleRequestOpen: () => void
};

type State = {
  open: boolean,
  rushee: Object
};

export default class VoteDialog extends PureComponent<Props, State> {
  state = {
    open: false,
    rushee: null
  };

  componentDidMount() {
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

  handleChange = (e: SyntheticEvent<>, value: string) => {
    const { displayName } = this.props.state;
    const { rushee } = this.state;

    API.voteForRushee(displayName, rushee, value)
    .then((res) => {
      console.log('Vote submitted');
      this.props.handleRequestOpen('Vote submitted');
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
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
