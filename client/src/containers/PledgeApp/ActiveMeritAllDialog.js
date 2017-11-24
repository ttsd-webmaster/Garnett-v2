import '../../components/MeritBook/ActiveMerit/ActiveMerit.css';

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class ActiveMerit extends Component {
  render(){
    const actions = [
      <FlatButton
        label="Demerit"
        primary={true}
        onClick={this.props.demeritAll}
      />,
      <FlatButton
        label="Merit"
        primary={true}
        onClick={this.props.meritAll}
      />,
    ];

    return (
      <Dialog
        title="Merit All"
        titleClassName="merit-all-dialog"
        actions={actions}
        modal={false}
        className="merit-dialog"
        bodyClassName="merit-dialog-body"
        contentClassName="merit-dialog-content"
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        <div className="merit-container">
          <TextField 
            type="text"
            floatingLabelText="Description"
            value={this.props.description}
            onChange={(e, newValue) => this.props.handleChange('description', newValue)}
            errorText={!this.props.descriptionValidation && 'Enter a description.'}
          />
          <br />
          <TextField 
            type="number"
            step={5}
            max={30}
            floatingLabelText="Amount"
            value={this.props.amount}
            onChange={(e, newValue) => this.props.handleChange('amount', newValue)}
            errorText={!this.props.amountValidation && 'Enter a valid amount.'}
          />
        </div>
      </Dialog>
    )
  }
}
