import React from 'react';
import Loadable from 'react-loadable';

export { Filter } from './Filter';
export { PledgeList } from './PledgeList';

export const LoadablePledgeInfoDialog = Loadable({
  loader: () => import('./Dialogs/PledgeInfoDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});
