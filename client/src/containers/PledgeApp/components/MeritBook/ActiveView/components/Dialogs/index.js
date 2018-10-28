import React from 'react';
import Loadable from 'react-loadable';

export const LoadableActiveMeritDialog = Loadable({
  loader: () => import('./ActiveMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

export const LoadablePledgeInfoDialog = Loadable({
  loader: () => import('./PledgeInfoDialog/PledgeInfoDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});
