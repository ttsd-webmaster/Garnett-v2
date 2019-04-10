// @flow

import { UserRow } from './UserRow';
import { FilterHeader } from 'components';
import type { User } from 'api/models';

import React, { Fragment } from 'react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

type Props = {
  users: User,
  selectedUsers: Array<User>,
  name: string,
  showAlumni?: boolean,
  selectUser: () => void,
  toggleAlumniView?: () => void
};

export function MeritDialogList(props: Props) {
  const {
    users,
    selectedUsers,
    name,
    showAlumni,
    selectUser,
    toggleAlumniView
  } = props;
  return (
    <Fragment>
      {showAlumni ? (
        <FilterHeader
          className="garnett-subheader mobile-merit"
          title={showAlumni ? 'Alumni' : 'Actives'}
          filterName={`View ${showAlumni ? 'Actives' : 'Alumni'}`}
          openPopover={toggleAlumniView}
        />
      ) : (
        <Subheader className="garnett-subheader merit-select">Pledges</Subheader>
      )}
      <List className="garnett-list merit-select">
        {users.map((user, i) => {
          const userName = user.firstName.toLowerCase();
          const searchedName = name.toLowerCase();
          const includesUser = selectedUsers.find((selectedUser) => {
            return selectedUser.firstName === user.firstName;
          });

          if (includesUser || !userName.startsWith(searchedName)) {
            return null;
          }
          else {
            return (
              <UserRow
                key={i}
                user={user}
                handleOpen={() => selectUser(user)}
              />
            )
          }
        })}
      </List>
    </Fragment>
  )
}
