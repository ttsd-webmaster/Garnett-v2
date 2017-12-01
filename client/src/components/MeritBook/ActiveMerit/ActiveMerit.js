import '../MeritBook.css';
import {loadFirebase, getDate} from '../../../helpers/functions.js';
import {LoadingMeritBook} from '../../../helpers/loaders.js';
import API from '../../../api/API.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const LoadableActiveMeritDialog = Loadable({
  loader: () => import('./ActiveMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      pledgeArray: this.props.pledgeArray,
      open: false,
      pledge: null,
      description: '',
      amount: '',
      meritArray: [],
      remainingMerits: '',
      descriptionValidation: true,
      amountValidation: true
    };
  }

  componentDidMount() {
    let pledgeArray = this.state.pledgeArray;

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let dbRef = firebase.database().ref('/users/');

        dbRef.on('value', (snapshot) => {
          pledgeArray = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          });
          pledgeArray = pledgeArray.filter(function(user) {
            return user.status === 'pledge';
          });

          console.log('Pledge array: ', pledgeArray);

          localStorage.setItem('pledgeArray', JSON.stringify(pledgeArray));
          
          this.setState({
            loaded: true,
            pledgeArray: pledgeArray
          });
        });
      });
    }
    else {
      this.setState({
        loaded: true
      });
    }
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
      if (this.state.remainingMerits - amount > 0) {
        let date = getDate();

        API.merit(displayName, pledgeName, activeName, description, amount, photoURL, date)
        .then(res => {
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
          let registrationToken = localStorage.getItem('registrationToken');

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
      value = parseInt(newValue)
    }

    this.setState({
      [label]: value,
      [validationLabel]: true
    });
  }

  handleOpen = (pledge) => {
    let displayName = this.props.state.displayName;

    if (navigator.onLine) {
      API.getActiveMerits(displayName, pledge)
      .then(res => {
        this.setState({
          open: true,
          pledge: pledge,
          remainingMerits: res.data.remainingMerits,
          meritArray: res.data.meritArray.reverse()
        });
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }
  }

  handleClose = () => {
    this.setState({
      open: false,
      description: '',
      amount: '',
      descriptionValidation: true,
      amountValidation: true
    });
  }

  render() {
    return (
      this.state.loaded ? (
        <div className="animate-in">
          <List className="pledge-list">
            {this.state.pledgeArray.map((pledge, i) => (
              <div key={i}>
                <Divider className="pledge-divider large" inset={true} />
                <ListItem
                  className="pledge-list-item large"
                  leftAvatar={<Avatar className="pledge-image large" size={70} src={pledge.photoURL} />}
                  primaryText={
                    <p className="pledge-name"> {pledge.firstName} {pledge.lastName} </p>
                  }
                  secondaryText={
                    <p>
                      {pledge.year}
                      <br />
                      {pledge.major}
                    </p>
                  }
                  secondaryTextLines={2}
                  onClick={() => this.handleOpen(pledge)}
                >
                  <p className="pledge-merits"> {pledge.totalMerits} </p>
                </ListItem>
                <Divider className="pledge-divider large" inset={true} />
              </div>
            ))}
          </List>
          <div style={{height: '40px'}}></div>
          
          <LoadableActiveMeritDialog
            open={this.state.open}
            pledge={this.state.pledge}
            description={this.state.description}
            amount={this.state.amount}
            descriptionValidation={this.state.descriptionValidation}
            amountValidation={this.state.amountValidation}
            remainingMerits={this.state.remainingMerits}
            meritArray={this.state.meritArray}
            merit={this.merit}
            demerit={this.demerit}
            handleClose={this.handleClose}
            handleChange={this.handleChange}
          />
        </div>
      ) : (
        <LoadingMeritBook />
      )
    )
  }
}
