import React from 'react';
import { LoadingComponent } from 'helpers/loaders.js';
import Loadable from 'react-loadable';

export const LoadableContacts = Loadable({
  loader: () => import('containers/PledgeApp/components/Contacts/Contacts'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

export const LoadableSettings = Loadable({
  loader: () => import('containers/PledgeApp/components/Settings/Settings'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

// export const LoadableChalkboards = Loadable({
//   loader: () => import('containers/PledgeApp/components/Chalkboards/Chalkboards'),
//   render(loaded, props) {
//     let Component = loaded.default;
//     return <Component {...props} />;
//   },
//   loading: LoadingComponent
// });

// export const LoadableComplaints = Loadable({
//   loader: () => import('containers/PledgeApp/components/Complaints/Complaints'),
//   render(loaded, props) {
//     let Component = loaded.default;
//     return <Component {...props} />;
//   },
//   loading: LoadingComponent
// });
