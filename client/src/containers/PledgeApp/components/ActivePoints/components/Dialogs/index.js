import React from 'react';
import Loadable from 'react-loadable';

export { BreakdownDialog } from './BreakdownDialog';
export { EditPointsDialog } from './EditPointsDialog';

export const LoadableAwardPointsDialog = Loadable({
  loader: () => import('./AwardPointsDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});
