import {LoadingDataApp} from '../../../helpers/loaders.js';
import API from '../../../api/API.js';

import React, {Component} from 'react';
import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const categories = ['Merit', 'Chalkboard'];

export default class MyData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    API.getMyData(this.props.state.name)
    .then((res) => {
      this.setState({
        myData: res.data,
        loaded: true
      });
    });
  }

  render() {
    return (
      <div id="my-data">
        {this.state.loaded ? (
          <div style={{animation: 'fadeIn .25s ease-in forwards'}}>
            <img className="user-photo" src={this.props.state.photoURL} alt="User" />

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
        ) : (
          <LoadingDataApp />
        )}
      </div>
    )
  }
}
