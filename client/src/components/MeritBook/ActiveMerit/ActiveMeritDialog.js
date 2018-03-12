import '../MeritBook.css';
import {getDate} from '../../../helpers/functions.js';
import API from '../../../api/API.js';

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
    return <div> Loading... </div>;
  }
});

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      amount: '',
      descriptionValidation: true,
      amountValidation: true
    };
  }

  merit = (pledge) => {
    let status = this.props.state.status;
    let maxAmount;
    let displayName = this.props.state.displayName;
    let pledgeName = pledge.firstName + pledge.lastName;
    let activeName = this.props.state.name;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let descriptionValidation = true;
    let amountValidation = true;

    if (status === 'alumni') {
      maxAmount = 50;
    }
    else {
      maxAmount = 30;
    }

    if (!description || !amount || amount > maxAmount || amount < 0) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount || amount > maxAmount || amount < 0) {
        amountValidation = false;
      }

      this.setState({
        descriptionValidation: descriptionValidation,
        amountValidation: amountValidation,
      });
    }
    else {
      if (this.props.remainingMerits - amount > 0) {
        let date = getDate();

        API.merit(displayName, pledgeName, activeName, description, amount, photoURL, date)
        .then(res => {
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
          let registrationToken = localStorage.getItem('registrationToken');

          this.props.handleClose();

          if (isSafari || !registrationToken) {
            this.props.handleRequestOpen(`Merited ${pledge.firstName} ${pledge.lastName}: ${amount} merits`);

            this.setState({
              open: false,
              description: '',
              amount: ''
            });
          }
          else {
            API.sendMessage(pledgeName, activeName, amount)
            .then(res => {
              this.props.handleRequestOpen(`Merited ${pledge.firstName} ${pledge.lastName}: ${amount} merits`);

              this.setState({
                open: false,
                description: '',
                amount: ''
              });
            })
            .catch(err => console.log(err));
          }
        })
        .catch(err => console.log('err', err));
      }
      else {
        console.log('Not enough merits');
        this.props.handleRequestOpen('Not enough merits.');
      }
    }
  }

  demerit = (pledge) => {
    let displayName = this.props.state.displayName;
    let pledgeName = pledge.firstName + pledge.lastName;
    let activeName = this.props.state.name;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let descriptionValidation = true;
    let amountValidation = true;

    if (!description || !amount || amount < 0) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount || amount < 0) {
        amountValidation = false;
      }

      this.setState({
        descriptionValidation: descriptionValidation,
        amountValidation: amountValidation,
      });
    }
    else {
      let date = getDate();

      API.merit(displayName, pledgeName, activeName, description, -amount, photoURL, date)
      .then(res => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        let registrationToken = localStorage.getItem('registrationToken');

        this.props.handleClose();

        if (isSafari || !registrationToken) {
          this.props.handleRequestOpen(`Demerited ${pledge.firstName} ${pledge.lastName}: ${amount} merits`);

          this.setState({
            open: false,
            description: '',
            amount: ''
          });
        }
        else {
          API.sendMessage(pledgeName, activeName, amount)
          .then(res => {
            this.props.handleRequestOpen(`Demerited ${pledge.firstName} ${pledge.lastName}: ${amount} merits`);

            this.setState({
              open: false,
              description: '',
              amount: ''
            });
          })
          .catch(err => console.log(err));
        }
      })
      .catch(err => console.log('err', err));
    }
  }

  handleChange = (label, newValue) => {
    let validationLabel = [label] + 'Validation';
    let value = newValue;

    if (label === 'amount') {
      value = parseInt(newValue, 10)
    }

    this.setState({
      [label]: value,
      [validationLabel]: true
    });
  }

  adjustScrollTop = (value) => {
    let meritDialog = document.querySelector('.garnett-dialog-body');

    if (value === 1) {
      let view = document.getElementById('merit-dialog-list');
      let height = view.clientHeight;
      
      meritDialog.style.backgroundColor = '#fafafa';
      
      setTimeout(() => {
        meritDialog.scrollTop = height;
      }, 1);
    }
    else {
      meritDialog.style.backgroundColor = '#fff';
    }
  }

  handleClose = () => {
    this.props.handleClose();

    this.setState({
      description: '',
      amount: '',
      descriptionValidation: true,
      amountValidation: true
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Demerit"
        primary={true}
        onClick={() => this.demerit(this.props.pledge)}
      />,
      <FlatButton
        label="Merit"
        primary={true}
        onClick={() => this.merit(this.props.pledge)}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        className="garnett-dialog"
        bodyClassName="garnett-dialog-body tabs"
        contentClassName="garnett-dialog-content"
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <Tabs
          className="garnett-dialog-tabs merit"
          inkBarStyle={inkBarStyle}
          onChange={this.adjustScrollTop}
        >
          <Tab label="Merits" value={0}>
            <div>
              <TextField 
                type="text"
                floatingLabelText="Description"
                value={this.state.description}
                onChange={(e, newValue) => this.handleChange('description', newValue)}
                errorText={!this.state.descriptionValidation && 'Enter a description.'}
              />
              <br />
              <TextField 
                type="number"
                step={5}
                max={30}
                floatingLabelText="Amount"
                value={this.state.amount}
                onChange={(e, newValue) => this.handleChange('amount', newValue)}
                errorText={!this.state.amountValidation && 'Enter a valid amount.'}
              />
              <p> Merits remaining: {this.props.remainingMerits} </p>
            </div>
          </Tab>
          <Tab label="Past Merits" value={1}>
            <LoadableMeritList merits={this.props.merits} />
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}
