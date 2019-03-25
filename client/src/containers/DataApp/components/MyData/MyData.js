// @flow

import './MyData.css';
import { LoadingDataApp } from 'helpers/loaders.js';
import API from 'api/API.js';

import React, { PureComponent } from 'react';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

const categories = ['Merit', 'Chalkboard'];

type Props = {
  name: string,
  photoURL: string
};

type State = {
  loaded: boolean
};

export class MyData extends PureComponent<Props, State> {
  state = { loaded: false };

  componentDidMount() {
    API.getMyData(this.props.name)
    .then((res) => {
      this.setState({
        myData: res.data,
        loaded: true
      });
    });
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingDataApp />
    }

    return (
      <div id="my-data">
        <div style={{animation: 'fadeIn .25s ease-in forwards'}}>
          <div className="user-photo-container">
            <img className="user-photo" src={this.props.photoURL} alt="User" />
          </div>

          {categories.map((category, i) => (
            <div className="data-card" key={i}>
              <div className="data-title"> {category}s </div>
              {[...new Map(this.state.myData)].map((data, j) => (
                (data[0].toLowerCase().includes(category.toLowerCase()) && (
                  <div key={j}>
                    <Divider className="garnett-divider" />
                    <ListItem
                      className="garnett-list-item"
                      primaryText={
                        <p className="data-key"> {data[0]} </p>
                      }
                    >
                      <p className="data-value my-data"> {data[1]} </p>
                    </ListItem>
                    <Divider className="garnett-divider" />
                  </div>
                ))
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
