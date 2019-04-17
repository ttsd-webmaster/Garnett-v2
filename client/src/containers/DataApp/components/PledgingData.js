// @flow

import API from 'api/API.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { ToggleViewHeader } from 'components';

import React, { PureComponent, type Node } from 'react';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const VIEW_OPTIONS = [
  { view: 'actives', label: 'Actives' },
  { view: 'pledges', label: 'Pledges' }
];

type State = {
  displayedData: ?Array<any>,
  activeData: ?Array<any>,
  pledgeData: ?Array<any>,
  photoMap: ?Array<any>,
  view: 'actives' | 'pledges'
};

export class PledgingData extends PureComponent<{}, State> {
  state = {
    displayedData: null,
    activeData: null,
    pledgeData: null,
    photoMap: null,
    view: 'actives'
  }

  componentDidMount() {
    API.getPledgingData()
    .then((res) => {
      const { activeData, pledgeData, photoMap } = res.data;
      this.setState({
        displayedData: activeData,
        activeData,
        pledgeData,
        photoMap: new Map(photoMap)
      });
    });
  }

  dataValue(columnTitle: string, dataValue: string): Node {
    if (columnTitle.includes('Amount')) {
      if (dataValue > 0) {
        return <p className="data-value green">+{ dataValue }</p>;
      } else {
        return <p className="data-value red">{ dataValue }</p>;
      }
    } else {
      return <p className="data-value">{ dataValue }</p>;
    }
  }

  setView = (value: string) => {
    let displayedData;
    switch (value) {
      case 'actives':
        displayedData = this.state.activeData;
        break;
      case 'pledges':
        displayedData = this.state.pledgeData;
        break;
      default:
    }
    this.setState({ displayedData, view: value });
  };

  render() {
    const { displayedData, photoMap, view } = this.state;

    if (!displayedData) {
      return <LoadingComponent />
    }

    return (
      <div id="pledging-data-container">
        <ToggleViewHeader
          className="garnett-subheader toggle-view"
          viewOptions={VIEW_OPTIONS}
          view={view}
          setView={this.setView}
        />
        <div id="darth-fader" />

        {displayedData.map((set, i) => (
          <div className="data-card" key={i}>
            <Subheader className="garnett-subheader">
              { set[0] }
            </Subheader>
            {set[1].map((entry, j) => (
              <div key={j}>
                <Divider className="garnett-divider" inset={true} />
                <ListItem
                  className="garnett-list-item"
                  leftAvatar={
                    <Avatar
                      className="garnett-image"
                      size={60}
                      src={photoMap.get(entry[0])}
                    />
                  }
                  primaryText={
                    <p className="data-key">{ entry[0] }</p>
                  }
                >
                  {this.dataValue(set[0], entry[1])}
                </ListItem>
                <Divider className="garnett-divider pledge-data" inset={true} />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}
