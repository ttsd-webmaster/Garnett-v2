import { PlaceholderRusheeList } from 'components/Placeholders';
import { InteractedCheckbox } from './InteractedCheckbox';

import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export class RusheeRow extends PureComponent {
  openRushee = (rushee) => {
    const rusheeName = rushee.name.replace(/ /g,'');
    this.props.history.push('/delibs-app/' + rusheeName, rusheeName);
  }

  render() {
    const { rushee, state } = this.props;
    return (
      <LazyLoad
        height={88}
        offset={window.innerHeight}
        once
        key={rushee.name}
        placeholder={PlaceholderRusheeList()}
      >
        <div>
          <Divider className="garnett-divider large" inset={true} />
          <ListItem
            className="garnett-list-item large"
            leftAvatar={rushee.rotate ? (
              <Avatar size={70} src={rushee.photo} className="garnett-image large rotate" />
            ) : (
              <Avatar size={70} src={rushee.photo} className="garnett-image large" />
            )}
            primaryText={
              <p className="garnett-name"> {rushee.name} </p>
            }
            secondaryText={
              <p>
                {rushee.year}
                <br />
                {rushee.major}
              </p>
            }
            secondaryTextLines={2}
            onClick={() => this.openRushee(rushee)}
          >
            <InteractedCheckbox state={state} rushee={rushee} />
          </ListItem>
          <Divider className="garnett-divider large" inset={true} />
        </div>
      </LazyLoad>
    )
  }
}
