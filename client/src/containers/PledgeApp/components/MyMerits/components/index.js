import React from 'react';
import Loadable from 'react-loadable';

export { MyMeritsList } from './MyMeritsList';
export { AllMeritsList } from './AllMeritsList';
export { ToggleViewHeader } from './ToggleViewHeader';

export const LoadableDeleteMeritDialog = Loadable({
  loader: () => import('./Dialogs/DeleteMeritDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>
  }
});
