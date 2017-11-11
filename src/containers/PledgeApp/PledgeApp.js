import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import ActiveMerit from '../../components/ActiveMerit/ActiveMerit';
import PledgeMerit from '../../components/PledgeMerit/PledgeMerit';
import Settings from '../../components/Settings/Settings';
import API from "../../api/API.js"
const firebase = window.firebase;

const tabContainerStyle = {
  position: 'fixed',
  top: 50,
  zIndex: 1
};

const swipeableViewStyle = {
  height: 'calc(100vh - 100px)',
  backgroundColor: '#fafafa',
  marginTop: '100px'
};

function MeritBook(props) {
  const isActive = props.active;

  if (isActive=='active') {
    return <ActiveMerit userArray={props.userArray} />;
  }
  else {
    return <PledgeMerit />;
  }
}

export default class PledgeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Merit Book',
      slideIndex: 0,
      active: false,
      loaded: false,
      userArray: [],
    };
  }

  componentDidMount() {
    console.log("Pledge app mount: ",this.props.state.token)
    API.getPledges(this.props.state.token)
        .then(res => {
                if(res.status==200){
                  
                  this.setState({
                    loaded:true,
                    userArray:res.data
                  })
                  console.log("userArray: ", this.state.userArray)
                }
              })
                .catch(err => console.log("err",err))
   
  }

  handleChange = (value) => {
    let title;

    if (value === 0) {
      title = 'Merit Book';
    }
    else if (value === 1) {
      title = 'Chalkboards';
    }
    else {
      title = 'Settings';
    }

    this.setState({
      title: title,
      slideIndex: value,
    });
  };

  render() {
    return (
      <div>
        <div className="app-header">
          {this.state.title}
        </div>
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
            icon={<i className="icon-calendar-empty"></i>}
            value={1}
          />
          <Tab
            icon={<i className="icon-sliders"></i>}
            value={2} 
          />
        </Tabs>
        <SwipeableViews
          style={swipeableViewStyle}
          animateHeight={true}
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          {this.state.loaded ? 
            <MeritBook active={this.props.state.status} userArray={this.state.userArray} /> : 
            <div></div>
          }
          <div> Chalkboards </div>
          <Settings state={this.props.state}/>
        </SwipeableViews>
      </div>
    )
  }
}