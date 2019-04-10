import React from 'react';
import Loadable from 'react-loadable';

export const LoadableMeritDialog = Loadable({
  loader: () => import('./MeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});
