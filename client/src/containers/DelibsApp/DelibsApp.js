// @flow

import { Header } from 'components';
import { RusheeList } from './components/RusheeList';
import { LoadableVoteDialog } from './RusheeProfile/components/Dialogs';
import type { User } from 'api/models';

import React from 'react';

type Props = {
  history: RouterHistory,
  state: User,
  handleRequestOpen: () => void
};

export function DelibsApp(props: Props) {
  return (
    <div className="loading-container">
      <Header title="Delibs App" history={props.history} />
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
