import { loadFirebase } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader, MeritRow } from 'components';

import React, { PureComponent} from 'react';
import { List } from 'material-ui/List';

export class AllMeritsList extends PureComponent {
  state = {
    loaded: false,
    allMerits: [],
    reverse: false
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const meritsRef = firebase.database().ref('/merits');

        meritsRef.once('value', (merits) => {
          let allMerits = [];

          // Retrieves the 50 most recent merits
          allMerits = Object.keys(merits.val()).map(function(key) {
            return merits.val()[key];
          }).reverse().slice(0, 50);

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

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    let { allMerits, reverse } = this.state;
    let toggleIcon = "icon-down-open-mini";

    if (this.props.hidden) {
      return null
    }

    if (!this.state.loaded) {
      return <LoadingComponent className={this.props.hidden ? "hidden" : ""} />;
    }

    if (reverse) {
      toggleIcon = "icon-up-open-mini";
      allMerits = allMerits.slice().reverse();
    }

    return (
      <List className="animate-in garnett-list">
        <FilterHeader
          title={reverse ? "Oldest" : "Recent"}
          toggleIcon={toggleIcon}
          reverse={this.reverse}
        />
        {allMerits.map((merit, i) => (
          <MeritRow
            key={i}
            merit={merit}
            photo={merit.activePhoto}
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
          />
        ))}
      </List>
    )
  }
}
