import '../../MeritBook.css';
import API from '../../../../api/API.js';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

export default class MeritsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      merits: [],
      reverse: false
    };
  }

  componentWillMount() {
    if (navigator.onLine) {
      API.getPledgeMerits(this.props.pledgeName)
      .then(res => {
        this.setState({
          merits: res.data
        });
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.handleRequestOpen('You are offline.');
    }
  }

  reverse = () => {
    let reverse = true;

    if (this.state.reverse) {
      reverse = false;
    }

    this.setState({
      reverse: reverse
    });
  }

  render() {
    let toggleIcon = "icon-down-open-mini";

    let merits = this.state.merits;

    if (this.state.reverse) {
      merits = merits.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    return (
      <div>
        <Subheader className="garnett-subheader dialog">
          Recent
          <IconButton
            style={{float:'right',cursor:'pointer'}}
            iconClassName={toggleIcon}
            className="reverse-toggle"
            onClick={this.reverse}
          >
          </IconButton>
        </Subheader>

        <List className="garnett-list dialog pledge">
          {merits.map((merit, i) => (
            <div key={i}>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={merit.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {merit.name} </p>
                }
                secondaryText={
                  <p> {merit.description} </p>
                }
                secondaryTextLines={2}
              >
                <div className="merit-amount-container">
                  <p className="merit-date"> {merit.date} </p>
                  <p className="merit-amount"> {merit.amount} </p>
                </div>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))}
        </List>
      </div>
    )
  }
}
