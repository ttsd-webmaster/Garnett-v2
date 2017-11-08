import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import ActiveMerit from '../../components/ActiveMerit/ActiveMerit';
import PledgeMerit from '../../components/PledgeMerit/PledgeMerit';
const firebase = window.firebase;

const tabContainerStyle = {
  position: 'fixed',
  zIndex: '1'
}

function MeritBook(props) {
  let user = firebase.auth().currentUser;
  let userRef = firebase.database().ref('/users/' + user.displayName);
  let userStatus;

  userRef.on('value', function(snapshot) {
    userStatus = snapshot.val().status;
  });
  
  if (userStatus === 'active') {
    return <ActiveMerit />;
  }
  else {
    return <PledgeMerit />;
  }
}

export default class PledgeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <div>
        <Tabs
          tabItemContainerStyle={tabContainerStyle}
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab 
            icon={<i className="icon-address-book"></i>}
            value={0}
          />
          <Tab
            icon={<i className="icon-users"></i>}
            value={1}
          />
          <Tab
            icon={<i className="icon-sliders"></i>}
            value={2} 
          />
        </Tabs>
        <SwipeableViews
          style={{marginTop: '48px'}}
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <MeritBook />
          <div> Chalkboards </div>
          <div> Settings </div>
        </SwipeableViews>
      </div>
    )
  }
}
