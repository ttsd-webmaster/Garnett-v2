// @flow

import { MeritDialogUserRow } from './MeritDialogUserRow';
import { FilterHeader } from 'components';
import { isMobile } from 'helpers/functions';
import type { User } from 'api/models';

import React, { Fragment, Component } from 'react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';

type Props = {
  users: ?User,
  isPledge: boolean,
  showAlumni?: boolean,
  selectUser: () => void,
  toggleAlumniView?: () => void
};

export class MeritDialogList extends Component<Props> {
  get header(): Node {
    const { isPledge, showAlumni, toggleAlumniView } = this.props;
    if (isPledge) {
      return (
        <FilterHeader
          className="garnett-subheader mobile-merit"
          title={showAlumni ? 'Alumni' : 'Actives'}
          filterName={`View ${showAlumni ? 'Actives' : 'Alumni'}`}
          openPopover={toggleAlumniView}
        />
      )
    }
    return (
      <Subheader className="garnett-subheader merit-select">Pledges</Subheader>
    )
  }

  get body(): Node {
    const { users, selectUser } = this.props;
    if (!users) {
      return (
        <div id="fetching-users">
          <CircularProgress
            color="var(--accent-color)"
            size={30}
            style={!isMobile() ? { marginBottom: '200px' } : null}
          />
        </div>
      )
    }
    if (users.length === 0) {
      return <div id="no-users-to-select" />
    }
    return (
      <List className="garnett-list merit-select">
        {users.map((user, i) => (
          <MeritDialogUserRow
            key={i}
            user={user}
            selectUser={() => selectUser(user)}
          />
        ))}
      </List>
    )
  }

  render() {
    return (
      <Fragment>
        { this.header }
        { this.body }
      </Fragment>
    )
  }
}
