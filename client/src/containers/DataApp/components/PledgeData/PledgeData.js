import './PledgeData.css';
import pledgeData from './data/pledgeData.json';
import API from 'api/API.js';
import { LoadingDataApp } from 'helpers/loaders.js';

import React, { PureComponent } from 'react';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export class PledgeData extends PureComponent {
  state = {
    photoMap: [],
    loaded: false
  }

  componentDidMount() {
    API.getPhotos(pledgeData)
    .then((res) => {
      this.setState({
        photoMap: new Map(res.data),
        loaded: true
      });
    });
  }

  render() {
    return (
      this.state.loaded ? (
        <div id="pledge-data" className="active">
          {pledgeData.map((set, i) => (
            <div className="data-card" key={i}>
              <div className="data-title"> {set[0]} </div>
              {[...new Map(set[1])].map((entry, j) => (
                <div key={j}>
                  <Divider className="garnett-divider pledge-data" inset={true} />
                  <ListItem
                    className="garnett-list-item pledge-data"
                    leftAvatar={<Avatar className="garnett-image" size={60} src={this.state.photoMap.get(entry[0])} />}
                    primaryText={
                      <p className="data-key"> {entry[0]} </p>
                    }
                  >
                    <p className="data-value"> {entry[1]} </p>
                  </ListItem>
                  <Divider className="garnett-divider pledge-data" inset={true} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <LoadingDataApp />
      )
    )
  }
}
