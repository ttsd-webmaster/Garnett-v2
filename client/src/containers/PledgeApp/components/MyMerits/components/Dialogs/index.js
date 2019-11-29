import React from 'react';
import Loadable from 'react-loadable';

export const LoadableMobileMeritDialog = Loadable({
  loader: () => import('./MobileMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});

export const LoadableEditMeritDialog = Loadable({
  loader: () => import('./EditMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});
