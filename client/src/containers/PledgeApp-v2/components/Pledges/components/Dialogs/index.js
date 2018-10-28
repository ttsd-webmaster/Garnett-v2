import React from 'react';
import Loadable from 'react-loadable';

export const LoadablePledgeInfoDialog = Loadable({
  loader: () => import('./PledgeInfoDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});
