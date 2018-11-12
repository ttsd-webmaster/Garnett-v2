import '../../../../MyMerits/MyMerits.css';
import './ActiveView.css';
import API from 'api/API.js';
import { FilterHeader, MeritRow } from 'components';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';

export class MeritsList extends PureComponent {
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
      <List className="garnett-list dialog pledge">
        <FilterHeader
          title={reverse ? "Oldest" : "Recent"}
          toggleIcon={toggleIcon}
          reverse={this.reverse}
        />
        {merits.map((merit, i) => (
          <MeritRow
            key={i}
            merit={merit}
            photo={merit.activePhoto}
            name={merit.activeName}
          />
        ))}
      </List>
    )
  }
}
