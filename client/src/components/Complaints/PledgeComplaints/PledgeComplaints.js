import '../Complaints.css';
import {loadFirebase} from '../../../helpers/functions.js';
import {LoadingComponent} from '../../../helpers/loaders.js';

import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listStyle = {
  textAlign: 'left'
};

const listItemStyle = {
  backgroundColor: '#fff',
  zIndex: -1
};

export default class PledgeComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      complaintsArray: this.props.complaintsArray
    }
  }

  componentDidMount() {
    let complaintsArray = this.state.complaintsArray;

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let fullName = this.props.state.displayName;
        let firebase = window.firebase;
        let complaintsRef = firebase.database().ref('/users/' + fullName + '/Complaints/');

        complaintsRef.on('value', (snapshot) => {
          if (snapshot.val()) {
            complaintsArray = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          console.log('Complaints Array: ', complaintsArray);
          localStorage.setItem('complaintsArray', JSON.stringify(complaintsArray));

          this.setState({
            loaded: true,
            complaintsArray: complaintsArray
          });
        });
      });
    }
    else {
      this.setState({
        loaded: true
      });
    }
  }

  componentDidUpdate() {
    let view = document.getElementById('pledge-complaints')

    if (view) {
      let height = view.clientHeight;
      let screenHeight = window.innerHeight - 100;

      if (height <= screenHeight) {
        view.style.height = 'calc(100vh - 100px)';
      }
      else {
        view.style.height = '';
      }
    }
  }

  render() {
    return (
      this.state.loaded ? (
        <div id="pledge-complaints">
          <List style={listStyle}>
            {this.state.complaintsArray.map((complaint, i) => (
              <LazyLoad
                height={88}
                offset={500}
                once
                unmountIfInvisible
                overflow
                key={i}
                placeholder={
                  <div className="placeholder-skeleton">
                    <Divider />
                    <div className="placeholder-description"></div>
                    <Divider />
                  </div>
                }
              >
                <div>
                  <Divider />
                  <ListItem
                    innerDivStyle={listItemStyle}
                    primaryText={
                      <p> {complaint.description} </p>
                    }
                  >
                    <p className="complaints-date"> {complaint.date} </p>
                  </ListItem>
                  <Divider />
                </div>
              </LazyLoad>
            ))}
          </List>
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}