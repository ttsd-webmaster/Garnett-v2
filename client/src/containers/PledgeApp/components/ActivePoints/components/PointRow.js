// @flow

import { formatDate } from 'helpers/functions';
import { PlaceholderMerit } from 'components/Placeholders';
import type { ActivePoint } from 'api/models';

import React, { Fragment, PureComponent, type Node } from 'react';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

type Props = {
  point: ActivePoint,
  showRecipient?: boolean,
  handleOptionsOpen?: (ActivePoint) => void
};

export class PointRow extends PureComponent<Props> {
  get body(): Node {
    const { point, showRecipient, handleOptionsOpen } = this.props;
    return (
      <div>
        <Divider className="garnett-divider large" inset={true} />
        <ListItem
          className="garnett-list-item large"
          leftAvatar={
            <Avatar
              size={70}
              src={showRecipient ? point.activePhoto : point.awardedByPhoto}
              className="garnett-image large"
            />
          }
          primaryText={
            <p className="garnett-name">
              { showRecipient ? point.activeName : point.title }
            </p>
          }
          secondaryText={
            <p className="garnett-description">
              {showRecipient && (
                <Fragment>
                  { point.title }
                  <br />
                </Fragment>
              )}
              Awarded by { point.awardedByName }
            </p>
          }
          secondaryTextLines={2}
          onClick={() => handleOptionsOpen && handleOptionsOpen(point)}
        >
          <div className="merit-amount-container">
            <p className="merit-date">{ formatDate(new Date(point.date)) }</p>
            {point.amount > 0 ? (
              <p className="merit-amount green">+{ point.amount }</p>
            ) : (
              <p className="merit-amount red">{ point.amount }</p>
            )}
          </div>
        </ListItem>
        <Divider className="garnett-divider large" inset={true} />
      </div>
    )
  }

  render() {
    const isIPhone = navigator.userAgent.match(/iPhone/i);
    // Lazyload doesn't work on iPhone for some reason
    if (isIPhone) {
      return this.body;
    }
    return (
      <LazyLoad
        height={88}
        offset={window.screen.height}
        once
        overflow
        placeholder={PlaceholderMerit()}
      >
        { this.body }
      </LazyLoad>
    )
  }
}
