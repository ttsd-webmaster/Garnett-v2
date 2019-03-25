// @flow

import { Header } from 'components';
import { RusheeList } from './components/RusheeList';
import { LoadableVoteDialog } from './RusheeProfile/components/Dialogs';

import React from 'react';

type Props = {
  history: RouterHistory,
  state: Object,
  handleRequestOpen: () => void
};

export function DelibsApp(props: Props) {
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
