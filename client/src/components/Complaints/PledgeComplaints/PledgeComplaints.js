import {loadFirebase} from '../../../helpers/functions.js';

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
      complaintsArray: this.props.complaintsArray,
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
            }).reverse();
          }

          console.log('Complaints Array: ', complaintsArray);
          localStorage.setItem('complaintsArray', JSON.stringify(complaintsArray));

          this.setState({
            loaded: true,
            complaintsArray: complaintsArray.reverse()
          }, function() {
            let height = document.getElementById('pledge-complaints').offsetHeight;
            let screenHeight = window.innerHeight - 100;

            if (height < screenHeight) {
              document.getElementById('pledge-complaints').style.height = 'calc(100vh - 100px)';
            }
          });
        });
      });
    }
    else {
      this.setState({
        loaded: true
      }, function() {
        let height = document.getElementById('pledge-complaints').offsetHeight;
        let screenHeight = window.innerHeight - 100;

        if (height < screenHeight) {
          document.getElementById('pledge-complaints').style.height = 'calc(100vh - 100px)';
        }
      });
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
                  </ListItem>
                  <Divider />
                </div>
              </LazyLoad>
            ))}
          </List>
        </div>
      ) : (
        <div className="loader-container">
          <div className="line-scale-container">
            <div className="line-scale">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      )
    )
  }
}