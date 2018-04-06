import '../../MeritBook.css';
import API from '../../../../api/API.js';
import {isMobileDevice} from '../../../../helpers/functions.js';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

let image = 'garnett-image';
let imageSize = 40;
let listItem = 'garnett-list-item';
let divider = 'garnett-divider';
let meritAmountContainer = 'merit-amount-container';
let meritDate = 'merit-date';
let meritAmount = 'merit-amount';

if (isMobileDevice()) {
  image += ' large';
  imageSize = 70;
  listItem += ' large';
  divider += ' large';
}
else {
  meritAmountContainer += ' small';
  meritDate += ' small';
  meritAmount += ' small';
}

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      merits: []
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      API.getPledgeMerits(this.props.pledge)
      .then(res => {
        this.setState({
          merits: res.data.merits
        });
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }
  }

  render() {
    return (
      <List id="merit-dialog-list">
        {this.state.merits.map((merit, i) => (
          <div key={i}>
            <div>
              <Divider className={divider} inset={true} />
              <ListItem
                className={listItem}
                leftAvatar={<Avatar className={image} size={imageSize} src={merit.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {merit.name} </p>
                }
                secondaryText={
                  <p> {merit.description} </p>
                }
              >
                <div className={meritAmountContainer}>
                  <p className={meritDate}> {merit.date} </p>
                  <p className={meritAmount}> {merit.amount} </p>
                </div>
              </ListItem>
              <Divider className={divider} inset={true} />
            </div>
          </div>
        ))}
      </List>
    )
  }
}
