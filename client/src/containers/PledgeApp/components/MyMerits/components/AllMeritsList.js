import { loadFirebase } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { PlaceholderMerit } from 'components/Placeholders';

import React, { PureComponent} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export class AllMeritsList extends PureComponent {
  state = {
    loaded: false,
    allMerits: []
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const meritsRef = firebase.database().ref('/merits');

        meritsRef.once('value', (merits) => {
          let allMerits = [];

          allMerits = Object.keys(merits.val()).map(function(key) {
            return merits.val()[key];
          }).sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          }).slice(0, 50);

          localStorage.setItem('allMerits', JSON.stringify(allMerits));

          this.setState({
            allMerits,
            loaded: true
          });
        });
      });
    }
    else {
      this.setState({ loaded: true });
    }
  }

  shortenedName(name) {
    const lastIndex = name.lastIndexOf(' ');
    const firstName = name.substr(0, lastIndex);
    const lastName = name.substr(lastIndex + 1)[0];
    return `${firstName} ${lastName}.`;
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingComponent />
    }

    return (
      <List className={`animate-in garnett-list${this.props.hidden ? " hidden" : ""}`}>
        {this.state.allMerits.map((merit, i) => (
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
                    size={70}
                    src={merit.pledgePhoto}
                    className="garnett-image large"
                  />
                }
                primaryText={
                  <p className="garnett-name all-merits">
                    {this.shortenedName(merit.activeName)}
                    <span style={{ fontWeight: 400 }}>
                      {merit.amount > 0
                        ? " merited "
                        : " demerited "
                      }
                    </span>
                    {this.shortenedName(merit.pledgeName)}
                  </p>
                }
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
    )
  }
}
