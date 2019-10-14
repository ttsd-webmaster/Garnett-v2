import React from 'react';
import Loadable from 'react-loadable';

export const LoadableSettingsDialog = Loadable({
  loader: () => import('./SettingsDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});
