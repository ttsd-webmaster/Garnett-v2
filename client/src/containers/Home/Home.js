import './Home.css';
import {LoadingHome} from '../../helpers/loaders.js';
import API from '../../api/API.js';

import React, {Component} from 'react';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    this.setState({
      loaded: true
    });
  }

  logout = () => {
    if (navigator.onLine) {
      API.logout()
      .then(res => {
        console.log(res);
        this.props.logoutCallBack();
        this.props.history.push('/');
      })
      .catch(err => console.log('err', err));
    }
    else {
      this.props.logoutCallBack();
      this.props.history.push('/');
    }
  }

  goTo = (route) => {
    this.props.history.push('/' + route);
  }

  render() {
    return (
      this.state.loaded ? (
        <div className="loading-container">
          <div className="app-header no-tabs">
            <span> Home </span>
            <span className="back-button" onClick={this.logout}> Log Out </span>
          </div>
          <div className="icon-container animate-in">
            <div className="app-icon" onClick={() => this.goTo('pledge-app')}>
              <div className="app-icon-image-container">
                <img 
                  className="app-icon-image"
                  src={require('./images/pledge-app-icon.png')}
                  alt="Pledge App"
                />
              </div>
              <p> Pledge App </p>
            </div>
            <div className="app-icon" onClick={() => this.goTo('delibs-app')}>
              <div className="app-icon-image-container">
                <img 
                  className="app-icon-image"
                  src={require('./images/delibs-icon.png')}
                  alt="Delibs App"
                />
              </div>
              <p> Delibs App </p>
            </div>
          </div>
        </div>
      ) : (
        <LoadingHome />
      )
    )
  }
}
