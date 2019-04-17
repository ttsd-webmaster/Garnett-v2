// @flow

import React from 'react';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';

type Props = {
  viewOptions: Array<{ view: string, label: string }>,
  view: string,
  setView: () => void
};

export function ToggleViewHeader(props: Props) {
  const { viewOptions, view, setView, ...rest } = props;
  return (
    <Subheader className="garnett-subheader merit-view" {...rest}>
      {viewOptions.map((option) => (
        <Chip
          key={option.view}
          className={`garnett-chip${view === option.view ? ' active' : ''}`}
          onClick={() => setView(option.view)}
        >
          { option.label }
        </Chip>
      ))}
    </Subheader>
  )
}
