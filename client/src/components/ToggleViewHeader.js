// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';

import { scrollToTop } from 'helpers/functions';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';

type Props = {
  location: Location,
  viewOptions: Array<{ view: string, label: string }>,
  view: string,
  setView: () => void
};

function ToggleViewHeader(props: Props) {
  const { location, viewOptions, view, setView, ...rest } = props;
  return (
    <Subheader className="garnett-subheader merit-view" {...rest}>
      {viewOptions.map((option) => (
        <Chip
          key={option.view}
          className={`garnett-chip${view === option.view ? ' active' : ''}`}
          onClick={() => {
            setView(option.view);
            scrollToTop(location.pathname);
          }}
        >
          {option.label}
        </Chip>
      ))}
    </Subheader>
  )
}

export default withRouter(ToggleViewHeader);
