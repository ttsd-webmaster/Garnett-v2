import './ActiveMerit.css';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const inkBarStyle = {
  position: 'fixed',
  top: '48px',
  backgroundColor: '#fff',
  zIndex: 2
};

const LoadableMeritList = Loadable({
  loader: () => import('./MeritList'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

export default class ActiveMerit extends Component {
  render() {
    const actions = [
      <FlatButton
        label="Demerit"
        primary={true}
        onClick={() => this.props.demerit(this.props.pledge)}
      />,
      <FlatButton
        label="Merit"
        primary={true}
        onClick={() => this.props.merit(this.props.pledge)}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        className="merit-dialog"
        bodyClassName="merit-dialog-body"
        contentClassName="merit-dialog-content"
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        <Tabs 
          className="merit-dialog-tabs"
          inkBarStyle={inkBarStyle}
        >
          <Tab label="Merits">
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
              <p> Merits remaining: {this.props.remainingMerits} </p>
            </div>
          </Tab>
          <Tab label="Past Merits">
            <LoadableMeritList meritArray={this.props.meritArray} />
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}
