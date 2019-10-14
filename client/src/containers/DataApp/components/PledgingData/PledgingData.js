// @flow

import './PledgingData.css';
import API from 'api/API.js';
import goldMedal from './images/gold.png';
import silverMedal from './images/silver.png';
import bronzeMedal from './images/bronze.png';
import { isMobile, setRefresh } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders';
import ToggleViewHeader from 'components/ToggleViewHeader';

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
  view: 'actives' | 'pledges' | null
};

export class PledgingData extends PureComponent<{}, State> {
  constructor(props) {
    super(props);
    const displayedData = JSON.parse(localStorage.getItem('displayedData'));
    const activeData = JSON.parse(localStorage.getItem('activeData'));
    const pledgeData = JSON.parse(localStorage.getItem('pledgeData'));
    const photoMap = JSON.parse(localStorage.getItem('photoMap'));
    const view = localStorage.getItem('pledgingDataView') || 'actives';
    this.state = {
      displayedData,
      activeData,
      pledgeData,
      photoMap: photoMap ? new Map(photoMap) : null,
      view
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      if (isMobile()) {
        localStorage.setItem('refreshContainerId', 'data-container');
        setRefresh(this.getPledgingData);
      }
      this.getPledgingData();
    }
  }

  dataValue(dataValue: { instances: number, amount: number }): Node {
    const { instances, amount } = dataValue;
    let color = '';

    if (amount > 0) {
      color = 'green';
    } else if (amount < 0) {
      color = 'red';
    }

    return (
      <div className="data-value-container">
        <p className="data-instance">{ instances } instances</p>
          <p className={`data-amount ${color}`}>
            { amount > 0 && '+' }{ amount }
          </p>
      </div>
    )
  }

  medal(index: number): ?Node {
    switch (index) {
      case 0:
        return <img className="medal" src={goldMedal} alt="Gold medal" />;
      case 1:
        return <img className="medal" src={silverMedal} alt="Silver medal" />;
      case 2:
        return <img className="medal" src={bronzeMedal} alt="Bronze medal" />;
      default:
    }
  }

  getPledgingData = () => {
    API.getPledgingData()
    .then((res) => {
      const { activeData, pledgeData, photoMap } = res.data;
      const displayedData = this.state.view === 'actives' ? activeData : pledgeData;

      localStorage.setItem('displayedData', JSON.stringify(displayedData));
      localStorage.setItem('activeData', JSON.stringify(activeData));
      localStorage.setItem('pledgeData', JSON.stringify(pledgeData));
      localStorage.setItem('photoMap', JSON.stringify(photoMap));

      this.setState({
        displayedData,
        activeData,
        pledgeData,
        photoMap: new Map(photoMap)
      });
    });
  }

  setView = (view: string) => {
    let displayedData;
    switch (view) {
      case 'actives':
        displayedData = this.state.activeData;
        break;
      case 'pledges':
        displayedData = this.state.pledgeData;
        break;
      default:
    }
    localStorage.setItem('pledgingDataView', view);
    this.setState({ displayedData, view });
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
                  primaryText={<p className="data-key">{ entry[0] }</p>}
                >
                  { this.medal(j) }
                  { this.dataValue(entry[1]) }
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
