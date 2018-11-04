import React from 'react';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';

export function ToggleViewHeader({ setMeritsView, ...rest }) {
  return (
    <Subheader className="garnett-subheader merit-view" {...rest}>
      <Chip
        className="garnett-chip"
        onClick={() => setMeritsView(false)}
      >
        My Merits
      </Chip>
      <Chip
        className="garnett-chip"
        onClick={() => setMeritsView(true)}
      >
        All Merits
      </Chip>
    </Subheader>
  )
}
