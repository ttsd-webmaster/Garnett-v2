import React from 'react';
import Loadable from 'react-loadable';

export const LoadableAddComplaintDialog = Loadable({
  loader: () => import('./AddComplaintDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export const LoadableHandleComplaintDialog = Loadable({
  loader: () => import('./HandleComplaintDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});
