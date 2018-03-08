import '../MeritBook.css';
import {loadFirebase} from '../../../helpers/functions.js';
import {LoadingComponent} from '../../../helpers/loaders.js';

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
      merits: this.props.merits,
      totalMerits: 0
    }
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let fullName = this.props.state.displayName;
        let userRef = firebase.database().ref('/users/' + fullName);
        let meritRef = firebase.database().ref('/users/' + fullName + '/Merits/');

        userRef.on('value', (user) => {
          let totalMerits = user.val().totalMerits;

          console.log('Total Merits: ', totalMerits);
          localStorage.setItem('totalMerits', totalMerits);

          meritRef.on('value', (snapshot) => {
            let merits = this.state.merits;

            if (snapshot.val()) {
              merits = Object.keys(snapshot.val()).map(function(key) {
                return snapshot.val()[key];
              });
            }

            console.log('Merit array: ', merits);
            localStorage.setItem('meritArray', JSON.stringify(merits));

            this.setState({
              loaded: true,
              totalMerits: totalMerits,
              merits: merits,
            });
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
    let view = document.getElementById('pledge-merit');

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
        <div className="animate-in">
          <List className="animate-in garnett-list no-header" id="pledge-merit">
            {this.state.merits.map((merit, i) => (
              <LazyLoad
                height={88}
                offset={500}
                once
                unmountIfInvisible
                overflow
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
                      <p className="garnett-name"> {merit.name} </p>
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

          <div className="total-merits"> 
            Total Merits: {this.state.totalMerits} 
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
