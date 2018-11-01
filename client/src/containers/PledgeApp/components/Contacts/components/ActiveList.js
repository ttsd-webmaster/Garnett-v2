import { PlaceholderContacts } from 'components/Placeholders.js';

import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export class ActiveList extends PureComponent {
  checkCondition(active) {
    switch (this.props.filter) {
      case 'firstName':
      case 'lastName':
        return active[this.props.filter].startsWith(this.props.label);
      case 'activeClass':
        return active.status !== 'alumni' && active.class === this.props.label;
      case 'alumni':
        return active.status === 'alumni' && active.class === this.props.label;
      default:
        return active[this.props.filter] === this.props.label;
    }
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
            placeholder={PlaceholderContacts()}
          >
            <div>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={active.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {active.firstName} {active.lastName}</p>
                }
                secondaryText={
                  <p className="garnett-description">
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
