import { Header } from 'components';
import { RusheeList } from './components/RusheeList';
import { LoadableVoteDialog } from './RusheeProfile/components/Dialogs';

import React from 'react';

export function DelibsApp({
  history,
  state,
  handleRequestOpen
}) {
  return (
    <div className="loading-container">
      <Header title="Delibs App" noTabs history={history} />
      <RusheeList state={state} />
      {state.status !== 'regent' && (
        <LoadableVoteDialog
          state={state}
          handleRequestOpen={handleRequestOpen}
        />
      )}
    </div>
  )
}
