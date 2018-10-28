import React, {Component} from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class ActiveList extends Component {
  checkCondition(active) {
    let condition = false;

    switch (this.props.filter) {
      case 'firstName':
      case 'lastName':
        condition = active[this.props.filter].startsWith(this.props.label);
        break;
      case 'activeClass':
        condition = active.status !== 'alumni' && active.class === this.props.label;
        break;
      case 'alumni':
        condition = active.status === 'alumni' && active.class === this.props.label;
        break;
      default:
        condition = active[this.props.filter] === this.props.label;
    }

    return condition;
  }

  render() {
    return (
      this.props.actives.map((active, i) => (
        this.checkCondition(active) &&
          <LazyLoad
            height={88}
            offset={window.innerHeight}
            once
            overflow
            key={i}
            placeholder={
              <div className="placeholder-skeleton">
                <Divider className="garnett-divider large" inset={true} />
                <div className="placeholder-avatar"></div>
                <div className="placeholder-name"></div>
                <div className="placeholder-year"></div>
                <div className="placeholder-major"></div>
                <Divider className="garnett-divider large" inset={true} />
              </div>
            }
          >
            <div>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={active.photoURL} />}
                primaryText={
                  <p className="active-name"> {active.firstName} {active.lastName}</p>
                }
                secondaryText={
                  <p>
                    {active.year}
                    <br />
                    {active.major}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.props.handleOpen(active)}
              />
              <Divider className="garnett-divider large" inset={true} />
            </div>
          </LazyLoad>
      ))
    )
  }
}
