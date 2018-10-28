import React from 'react';
import Loadable from 'react-loadable';

export const LoadableDeleteMeritDialog = Loadable({
  loader: () => import('./DeleteMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

export const LoadablePledgeMeritDialog = Loadable({
  loader: () => import('./PledgeMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});
