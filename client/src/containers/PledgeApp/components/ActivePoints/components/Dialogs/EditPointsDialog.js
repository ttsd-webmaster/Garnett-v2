// @flow

import API from 'api/API.js';
import type { User, ActivePoint } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

type Props = {
  state: User,
  point: ?ActivePoint,
  view: 'edit' | 'delete' | null,
  open: boolean,
  handleClose: () => void,
  onChanged: () => void,
  handleRequestOpen: (string) => void
};

type State = {
  title: string,
  amount: string,
  updating: boolean
};

// A negative award is a deduction, so taking it back gives points back
function takeBackPhrase(point: ActivePoint, done?: boolean): string {
  const amount = Math.abs(point.amount);
  if (point.amount < 0) {
    return `${done ? 'Removed' : 'Remove'} the ${amount} point deduction from ${point.activeName}`;
  }
  return `${done ? 'Took back' : 'Take back'} ${amount} points from ${point.activeName}`;
}

// Corrects or takes back a point award. Admins only.
export class EditPointsDialog extends PureComponent<Props, State> {
  state = {
    title: '',
    amount: '',
    updating: false
  };

  componentDidUpdate(prevProps: Props) {
    const { open, point } = this.props;
    if (prevProps.open === false && open === true && point) {
      this.setState({
        title: point.title,
        amount: String(point.amount)
      });
    }
  }

  get title(): string {
    switch (this.props.view) {
      case 'edit':
        return 'Correct Points';
      case 'delete':
        return 'Take Back Points';
      default:
        return '';
    }
  }

  get body(): ?Node {
    const { view, point } = this.props;
    const { title, amount } = this.state;

    switch (view) {
      case 'edit':
        return (
          <div id="points-edit-inputs">
            <input
              className="points-input"
              type="text"
              placeholder="Title"
              autoComplete="off"
              value={title}
              onChange={(event) => this.setState({ title: event.target.value })}
            />
            <input
              className="points-input"
              type="number"
              placeholder="Points"
              autoComplete="off"
              value={amount}
              onChange={(event) => this.setState({ amount: event.target.value })}
            />
          </div>
        );
      case 'delete':
        return point ? `${takeBackPhrase(point)}?` : 'Are you sure?';
      default:
        return null;
    }
  }

  get buttons(): ?Node {
    const { view, handleClose } = this.props;
    const { updating } = this.state;
    const spinner = (
      <CircularProgress size={25} thickness={2.5} style={{ top: '5px' }} />
    );
    const label = view === 'delete' ? 'Take Back' : 'Update';
    const disabled = view === 'delete'
      ? updating
      : (updating || !this.isValid);
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
        onClick={action}
      />
    ];
  }

  get isValid(): boolean {
    const { point } = this.props;
    const { title, amount } = this.state;
    const parsedAmount = Number(amount);

    if (!point || !title.trim()) {
      return false;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount === 0) {
      return false;
    }

    // Nothing to update
    return parsedAmount !== point.amount || title.trim() !== point.title;
  }

  update = () => {
    const { state, point, handleRequestOpen } = this.props;
    const { title, amount } = this.state;

    if (!point) {
      return;
    }

    this.setState({ updating: true });

    API.updatePoints(state.displayName, point.key, Number(amount), title.trim())
    .then(() => {
      this.setState({ updating: false });
      handleRequestOpen(`Corrected points for ${point.activeName}.`);
      this.props.onChanged();
    })
    .catch((error) => {
      console.error(error);
      this.setState({ updating: false });
      const message = (error.response && error.response.data) ||
        'Could not correct those points.';
      this.props.handleClose();
      handleRequestOpen(message);
    });
  }

  delete = () => {
    const { state, point, handleRequestOpen } = this.props;

    if (!point) {
      return;
    }

    this.setState({ updating: true });

    API.deletePoints(state.displayName, point.key)
    .then(() => {
      this.setState({ updating: false });
      handleRequestOpen(`${takeBackPhrase(point, true)}.`);
      this.props.onChanged();
    })
    .catch((error) => {
      console.error(error);
      this.setState({ updating: false });
      const message = (error.response && error.response.data) ||
        'Could not take back those points.';
      this.props.handleClose();
      handleRequestOpen(message);
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
