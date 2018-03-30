import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const bodyStyle = {
  padding: 0
};

const contentStyle = {
  height: '100vh',
  width: '100vw'
};

export default class ResumeDialog extends Component {
  onBackButton = (event) => {
    if (event.keyCode == 27) {
      event.preventDefault();
      this.props.handleClose();
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onBackButton);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onBackButton);
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        bodyStyle={bodyStyle}
        contentStyle={contentStyle}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        <img src={this.props.resume} width="100%" alt="Resume" />
      </Dialog>
    )
  }
}
