import React from 'react';
import Loadable from 'react-loadable';

export { ActiveList } from './ActiveList';
export { Filter } from './Filter';
export { Header } from './Header';

export const LoadableContactsDialog = Loadable({
  loader: () => import('./Dialogs/ContactsDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});
