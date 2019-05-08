// @flow

import API from 'api/API.js';
import { PLEDGING_START_DATE, PLEDGING_END_DATE } from 'helpers/constants';
import { formatDate } from 'helpers/functions';
import type { User, Merit } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

type Props = {
  state: User,
  merit: Merit,
  view: 'edit' | 'delete',
  open: boolean,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  date: ?Date,
  updating: boolean
};

export default class EditMeritDialog extends PureComponent<Props, State> {
  state = {
    date: null,
    updating: false
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.open === false && this.props.open === true) {
      this.setState({
        date: new Date(this.props.merit.date)
      });
    }
  }

  get title(): string {
    switch (this.props.view) {
      case 'edit':
        return 'Edit Merit';
      case 'delete':
        return 'Delete Merit';
      default:
        return '';
    }
  }

  get body(): ?Node {
    switch (this.props.view) {
      case 'edit':
        return (
          <DayPickerInput
            value={this.state.date}
            formatDate={formatDate}
            onDayChange={this.setDate}
            inputProps={{ readOnly: true }}
            dayPickerProps={{
              selectedDays: this.state.date,
              fromMonth: PLEDGING_START_DATE,
              toMonth: PLEDGING_END_DATE,
              disabledDays: [{
                after: new Date(),
                before: PLEDGING_START_DATE
              }]
            }}
          />
        );
      case 'delete':
        return 'Are you sure?';
      default:
        return null;
    }
  }

  get buttons(): ?Node {
    const { merit, view, handleClose } = this.props;
    const { updating } = this.state;
    const spinner = (
      <CircularProgress size={25} thickness={2.5} style={{ top: '5px' }} />
    );
    const label = view === 'delete' ? 'Delete' : 'Update';
    const disabled = view === 'delete' ? updating : (updating || !this.isDateValid);
    const action = view === 'delete' ? this.delete : this.update;
    return [
      <FlatButton
        label="Just Kidding"
        primary={true}
        disabled={updating}
        onClick={handleClose}
      />,
      <RaisedButton
        label={updating ? spinner : label}
        primary={true}
        disabled={disabled}
        onClick={() => action(merit)}
      />
    ];
  }

  get isDateValid(): boolean {
    const { merit } = this.props;
    const { date } = this.state;
    return date && merit && (date.getTime() !== merit.date);
  }

  enterDelete = () => this.setState({ view: 'delete' });

  setDate = (date: Date) => this.setState({ date });

  update = (merit: Merit) => {
    const { displayName, status } = this.props.state;
    const date = this.state.date.getTime();

    this.setState({ updating: true });

    API.updateMerit(displayName, status, merit, date)
    .then((res) => {
      let message = `Updated merit for ${merit.pledgeName}.`;
      if (status === 'pledge') {
        message = `Updated merit from ${merit.activeName}.`;
      }
      this.props.handleClose();
      this.props.handleRequestOpen(message);
      this.setState({ updating: false });
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
      this.props.handleClose();
      this.props.handleRequestOpen('You can only edit merits you created.');
      this.setState({ updating: false });
    });
  }

  delete = (merit: Merit) => {
    const { displayName, status } = this.props.state;

    this.setState({ updating: true });

    API.deleteMerit(displayName, status, merit)
    .then((res) => {
      let message = `Deleted merit for ${merit.pledgeName}.`;
      if (status === 'pledge') {
        message = `Deleted merit from ${merit.activeName}.`;
      }
      this.props.handleClose();
      this.props.handleRequestOpen(message);
      this.setState({ updating: false });

      API.sendDeletedMeritNotification(merit)
      .then(res => console.log(res))
      .catch(error => console.error(`Error: ${error}`));
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
      this.props.handleClose();
      this.props.handleRequestOpen('You can only delete merits you created.');
      this.setState({ updating: false });
    });
  }

  render() {
    return (
      <Dialog
        title={this.title}
        actions={this.buttons}
        contentClassName="garnett-dialog-content edit-merit"
        open={this.props.open}
        onRequestClose={this.props.handleClose}
      >
       { this.body }
      </Dialog>
    )
  }
}
