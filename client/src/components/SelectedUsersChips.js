// @flow

import type { User } from 'api/models';

import React from 'react';
import Chip from 'material-ui/Chip';

type Props = {
  selectedUsers: Array<User>,
  deselectUser: (User) => void
};

export function SelectedUsersChips(props: Props) {
  return (
    props.selectedUsers.length > 0 && (
      <div className="chips-container select-users">
        {props.selectedUsers.map((user, i) => (
          <Chip
            key={i}
            className="garnett-chip merit-dialog active"
            onClick={() => props.deselectUser(user)}
            onRequestDelete={() => props.deselectUser(user)}
          >
            { user.firstName }
          </Chip>
        ))}
      </div>
    )
  )
}
