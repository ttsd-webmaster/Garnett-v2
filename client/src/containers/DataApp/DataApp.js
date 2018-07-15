import './DataApp.css';
import '../PledgeApp/PledgeApp.css';
import {LoadingDataApp} from '../../helpers/loaders.js';
import API from '../../api/API.js';
import pledgeData from './data/pledgeData.json';

import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class DataApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoMap: [],
      loaded: false
    };
  }

  componentWillMount() {
    localStorage.setItem('route', 'data-app');

    let photoMap = new Map();
    let data = Object.keys(pledgeData).map(function(key) {
      return pledgeData[key];
    });

    data.forEach((set) => {
      [...new Map(JSON.parse(set))].forEach((entry) => {
        API.getPhoto(entry[0])
        .then((res) => {
          photoMap.set(entry[0], res.data);

          this.setState({
            loaded: true,
            photoMap: photoMap
          }); 
        }); 
      });
    });
  }

  goHome = () => {
    this.props.history.push('/home');
  }

  render() {
    let data = Object.keys(pledgeData).map(function(key) {
      return [key, pledgeData[key]];
    });

    return (
      this.state.loaded ? (
        <div className="loading-container">
          <div className="app-header no-tabs">
            <span> Data App </span>
            <span className="back-button" onClick={this.goHome}> Home </span>
          </div>
          <div className="data-container">
            {data.map((set, i) => (
              <div className="data-card" key={i}>
                <div className="data-title"> {set[0]} </div>
                {[...new Map(JSON.parse(set[1]))].map((entry, j) => (
                  <div key={j}>
                    <Divider className="garnett-divider data" inset={true} />
                    <ListItem
                      className="garnett-list-item data"
                      leftAvatar={<Avatar className="garnett-image" size={60} src={this.state.photoMap.get(entry[0])} />}
                      primaryText={
                        <p className="data-key"> {entry[0]} </p>
                      }
                    >
                      <p className="data-value"> {entry[1]} </p>
                    </ListItem>
                    <Divider className="garnett-divider data" inset={true} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <LoadingDataApp />
      )
    )
  }
}
