import '../MeritBook.css';
import loadFirebase from '../../../helpers/loadFirebase';

import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const listItemStyle = {
  backgroundColor: '#fff',
  paddingLeft: '102px',
  zIndex: -1
};

const avatarStyle = {
  top: 9,
  objectFit: 'cover'
};

const dividerStyle = {
  marginLeft: '102px'
};

export default class PledgeMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      meritArray: this.props.meritArray
    }
  }

  componentDidMount() {
    let meritArray = this.state.meritArray;

    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let fullName = this.props.state.displayName;
        let meritRef = firebase.database().ref('/users/' + fullName + '/Merits/');

        meritRef.on('value', (snapshot) => {
          if (snapshot.val()) {
            meritArray = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          console.log('Merit array: ', meritArray);

          localStorage.setItem('meritArray', JSON.stringify(meritArray));

          this.setState({
            loaded: true,
            meritArray: meritArray.reverse(),
          }, function() {
            let height = document.getElementById('pledge-merit').clientHeight;
            let screenHeight = window.innerHeight - 166;

            if (height < screenHeight) {
              document.getElementById('pledge-merit').style.height = 'calc(100vh - 166px)';
            }
          });
        });
      });
    }
    else {
      this.setState({
        loaded: true,
        meritArray: meritArray.reverse(),
      }, function() {
        let height = document.getElementById('pledge-merit').clientHeight;
        let screenHeight = window.innerHeight - 166;

        if (height < screenHeight) {
          document.getElementById('pledge-merit').style.height = 'calc(100vh - 166px)';
        }
      });
    }
  }

  render() {
    return (
      this.state.loaded ? (
        <List className="animate-in" id="pledge-merit">
          {this.state.meritArray.map((merit, i) => (
            <LazyLoad
              height={88}
              offset={300}
              unmountIfInvisible
              key={i}
              placeholder={
                <div className="placeholder-skeleton">
                  <Divider style={dividerStyle} inset={true} />
                  <div className="placeholder-avatar"></div>
                  <div className="placeholder-name"></div>
                  <div className="placeholder-year"></div>
                  <div className="placeholder-date"></div>
                  <div className="placeholder-merits"></div>
                  <Divider style={dividerStyle} inset={true} />
                </div>
              }
            >
              <div>
                <Divider style={dividerStyle} inset={true} />
                <ListItem
                  innerDivStyle={listItemStyle}
                  leftAvatar={<Avatar size={70} src={merit.photoURL} style={avatarStyle} />}
                  primaryText={
                    <p className="merit-name"> {merit.name} </p>
                  }
                  secondaryText={
                    <p> {merit.description} </p>
                  }
                  secondaryTextLines={2}
                >
                  <div className="merit-amount-container">
                    <p className="merit-date"> {merit.date} </p>
                    <p className="merit-amount"> {merit.amount} </p>
                  </div>
                </ListItem>
                <Divider style={dividerStyle} inset={true} />
              </div>
            </LazyLoad>
          ))}
        </List> 
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
