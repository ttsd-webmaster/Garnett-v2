import API from 'api/API.js';
import { PlaceholderMerit } from 'helpers/Placeholders.js';

import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
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

  componentDidMount() {
    if (navigator.onLine) {
      API.getPledgeMerits(this.props.pledgeName)
      .then(res => {
        this.setState({ merits: res.data });
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }
  }

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    let toggleIcon = "icon-down-open-mini";
    let { merits, reverse } = this.state;

    if (reverse) {
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
          />
        </Subheader>

        <List className="garnett-list dialog pledge">
          {merits.map((merit, i) => (
            <LazyLoad
              height={88}
              offset={window.innerHeight}
              once
              overflow
              key={i}
              placeholder={PlaceholderMerit()}
            >
              <div>
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
                    {merit.amount > 0 ? (
                      <p className="merit-amount green">+{merit.amount}</p>
                    ) : (
                      <p className="merit-amount red">{merit.amount}</p>
                    )}
                  </div>
                </ListItem>
                <Divider className="garnett-divider large" inset={true} />
              </div>
            </LazyLoad>
          ))}
        </List>
      </div>
    )
  }
}
