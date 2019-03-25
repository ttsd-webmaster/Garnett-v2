// @flow

import React from 'react';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';

type Props = {
  view: 'myMerits' | 'allMerits',
  setView: () => void
};

export function ToggleViewHeader(props: Props) {
  const { view, setView, ...rest } = props;
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
