import '../Complaints.css';
import {loadFirebase} from '../../../helpers/functions.js';
import {LoadingComponent} from '../../../helpers/loaders.js';

import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listItemStyle = {
  backgroundColor: '#fff',
  zIndex: -1
};

export default class PledgeComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      complaints: this.props.complaints
    }
  }

  componentWillMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let fullName = this.props.state.displayName;
        let firebase = window.firebase;
        let complaintsRef = firebase.database().ref('/users/' + fullName + '/Complaints/');

        complaintsRef.on('value', (snapshot) => {
          let complaints = this.state.complaints;

          if (snapshot.val()) {
            complaints = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          console.log('Complaints Array: ', complaints);
          localStorage.setItem('pledgeComplaintsArray', JSON.stringify(complaints));

          this.setState({
            loaded: true,
            complaints: complaints
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
    let view = document.getElementById('pledge-complaints');

    if (view) {
      let height = view.clientHeight;

      if (this.props.scrollPosition) {
        view.parentNode.scrollTop = this.props.scrollPosition;
      }
      else {
        view.parentNode.scrollTop = height;
      }
    }
  }

  render() {
    return (
      this.state.loaded ? (
        <div id="pledge-complaints">
          <List className="garnett-list no-header">
            {this.state.complaints.map((complaint, i) => (
              <LazyLoad
                height={88}
                offset={500}
                once
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
                      <p className="garnett-description">
                        {complaint.description}
                      </p>
                    }
                  >
                    <p className="garnett-date"> {complaint.date} </p>
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