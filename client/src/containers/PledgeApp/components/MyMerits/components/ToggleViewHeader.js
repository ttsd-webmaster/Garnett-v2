import React from 'react';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';

export function ToggleViewHeader({ view, setView, ...rest }) {
  return (
    <Subheader className="garnett-subheader merit-view" {...rest}>
      <Chip
        className={`garnett-chip${view === 'myMerits' ? ' active' : ''}`}
        onClick={() => setView('myMerits')}
      >
        My Merits
      </Chip>
      <Chip
        className={`garnett-chip${view === 'allMerits' ? ' active' : ''}`}
        onClick={() => setView('allMerits')}
      >
        All Merits
      </Chip>
    </Subheader>
  )
}
