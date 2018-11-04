import API from 'api/API.js';
import { PlaceholderMerit } from 'components/Placeholders';
import { FilterHeader } from 'components';

import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class MeritsList extends PureComponent {
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
        <FilterHeader
          title={reverse ? "Oldest" : "Recent"}
          toggleIcon={toggleIcon}
          reverse={this.reverse}
        />

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
                  leftAvatar={
                    <Avatar
                      className="garnett-image large"
                      size={70}
                      src={merit.activePhoto}
                    />
                  }
                  primaryText={<p className="garnett-name"> {merit.activeName} </p>}
                  secondaryText={
                    <p className="garnett-description"> {merit.description} </p>
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
