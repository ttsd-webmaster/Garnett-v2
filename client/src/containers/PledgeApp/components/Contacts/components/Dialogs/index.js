import React from 'react';
import Loadable from 'react-loadable';

export const LoadableContactsDialog = Loadable({
  loader: () => import('./ContactsDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});
