import { Header } from 'components/Header';
import { RusheeList } from './components/RusheeList';
import { LoadableVoteDialog } from './RusheeProfile/components/Dialogs';

import React from 'react';

export default function DelibsApp(props) {
  return (
    <div className="loading-container">
      <Header title="Delibs App" noTabs history={props.history} />
      <RusheeList state={props.state} />
      {props.state.status !== 'regent' && (
        <LoadableVoteDialog
          state={props.state}
          handleRequestOpen={props.handleRequestOpen}
        />
      )}
    </div>
  )
}
