// @flow

import { LoadingComponent } from 'helpers/loaders.js';
import API from 'api/API.js';

import React, { Fragment, PureComponent } from 'react';
import { ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const CATEGORIES = ['Merit', 'Chalkboard'];

type Props = {
  history: RouterHistory,
  name: string,
  photoURL: string
};

type State = {
  myData: ?Array<any>
};

export class MyData extends PureComponent<Props, State> {
  state = { loaded: false };

  componentDidMount() {
    API.getMyData(this.props.name)
    .then((res) => {
      this.setState({ myData: res.data, });
    });
  }

  goHome = () => {
    this.props.history.push('/home');
  }

  render() {
    if (!this.state.myData) {
      return <LoadingComponent />
    }

    return (
      <Fragment>
        <div className="user-photo-container">
          <img className="user-photo" src={this.props.photoURL} alt="User" />
        </div>
        <h1 className="user-name">{ this.props.name }</h1>

        {CATEGORIES.map((category, i) => (
          <div className="data-card" key={i}>
            <Subheader className="garnett-subheader data-app">
              { category }s
            </Subheader>
            {[...new Map(this.state.myData)].map((data, j) => (
              (data[0].toLowerCase().includes(category.toLowerCase()) && (
                <div key={j}>
                  <Divider className="garnett-divider" />
                  <ListItem
                    className="garnett-list-item"
                    primaryText={
                      <p className="data-key">{ data[0] }</p>
                    }
                  >
                    <p className="data-value my-data">{ data[1] }</p>
                  </ListItem>
                  <Divider className="garnett-divider" />
                </div>
              ))
            ))}
          </div>
        ))}

        <div className="logout-button" onClick={this.goHome}>Back Home</div>
      </Fragment>
    )
  }
}
