import { loadFirebase } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader } from 'components';
import { PlaceholderPledgeComplaint } from 'components/Placeholders';

import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

const listItemStyle = {
  backgroundColor: '#fff',
  zIndex: -1
};

export default class PledgeComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      complaints: [],
      reverse: false
    }
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { displayName } = this.props.state;
        const { firebase } = window;
        const complaintsRef = firebase.database().ref('/users/' + displayName + '/Complaints/');

        complaintsRef.sortByChild('date').on('value', (snapshot) => {
          let { complaints } = this.state;

          if (snapshot.val()) {
            complaints = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          console.log(`Complaints Array: ${complaints}`);
          localStorage.setItem('pledgeComplaints', JSON.stringify(complaints));

          this.setState({
            loaded: true,
            complaints
          });
        });
      });
    }
    else {
      const complaints = localStorage.getItem('pledgeComplaints');
      this.setState({
        loaded: true,
        complaints
      });
    }
  }

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    let { complaints, reverse, loaded } = this.state;

    if (reverse) {
      complaints = complaints.slice().reverse();
    }

    if (!loaded) {
      return <LoadingComponent />
    }

    return (
      <div id="pledge-complaints">
        <FilterHeader
          title="Recent"
          isReversed={reverse}
          reverse={this.reverse}
        />

        <List className="garnett-list">
          {complaints.map((complaint, i) => (
            <LazyLoad
              height={88}
              offset={window.innerHeight}
              once
              overflow
              key={i}
              placeholder={PlaceholderPledgeComplaint()}
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
    )
  }
}