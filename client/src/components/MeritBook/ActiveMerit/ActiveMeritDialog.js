import './ActiveMerit.css';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const inkBarStyle = {
  position: 'relative',
  top: '46px',
  backgroundColor: '#fff',
  zIndex: 2
};

export default class ActiveMerit extends Component {
  render(){
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
            <List className="pledge-list">
              {this.props.meritArray.reverse().map((merit, i) => (
                <div key={i}>
                  <ListItem
                    className="pledge-list-item"
                    leftAvatar={<Avatar src={merit.photoURL} />}
                    primaryText={
                      <p className="merit-name"> {merit.name} </p>
                    }
                    secondaryText={
                      <p>
                        {merit.description}
                      </p>
                    }
                  >
                    <p className="merit-amount small"> {merit.amount} </p>
                  </ListItem>
                  <Divider className="pledge-divider" inset={true} />
                </div>
              ))}
            </List>
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}
