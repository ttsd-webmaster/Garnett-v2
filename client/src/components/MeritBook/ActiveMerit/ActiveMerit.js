import '../MeritBook.css';
import getDate from '../../../helpers/getDate';
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

  merit = (pledge) => {
    let token = this.props.state.token;
    let pledgeName = pledge.firstName + pledge.lastName;
    let activeName = this.props.state.name;
    let description = this.state.description;
    let amount = this.state.amount;
    let photoURL = this.props.state.photoURL;
    let descriptionValidation = true;
    let amountValidation = true;

    if (!description || !amount || amount > 30 || amount < 0) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!amount || amount > 30 || amount < 0) {
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

        API.merit(token, pledgeName, activeName, description, amount, photoURL, date)
        .then(res => {
          console.log(res);
          this.props.handleRequestOpen(`Merited ${pledge.firstName} ${pledge.lastName}: ${amount} merits`);

          this.setState({
            open: false,
            description: '',
            amount: ''
          });
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
    let token = this.props.state.token;
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

      API.merit(token, pledgeName, activeName, description, -amount, photoURL, date)
      .then(res => {
        console.log(res);
        this.props.handleRequestOpen(`Demerited ${pledge.firstName} ${pledge.lastName}: ${amount} merits`);

        this.setState({
          open: false,
          description: '',
          amount: ''
        });
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
    API.getActiveMerits(pledge)
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
      <div>
        <List className="pledge-list">
          {this.props.pledgeArray.map((pledge, i) => (
            <div key={i}>
              <Divider className="pledge-divider large" inset={true} />
              <ListItem
                className="pledge-list-item large"
                leftAvatar={<Avatar className="pledge-image" size={70} src={pledge.photoURL} />}
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
        
        {/*<LoadableActiveMeritDialog
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
        />*/}
      </div>
    )
  }
}
