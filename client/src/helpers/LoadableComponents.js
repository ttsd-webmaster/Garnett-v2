import React from 'react';
import {
  LoadingLogin,
  LoadingHome,
  LoadingPledgeApp,
  LoadingDelibsApp,
  LoadingRusheeProfile,
  LoadingDataApp,
  LoadingComponent
} from 'helpers/loaders.js';
import Loadable from 'react-loadable';

export const LoadableLogin = Loadable({
  loader: () => import('containers/Login/Login'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingLogin
});

export const LoadableHome = Loadable({
  loader: () => import('containers/Home/Home'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingHome
});

export const LoadablePledgeApp = Loadable({
  loader: () => import('containers/PledgeApp/PledgeApp'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingPledgeApp
});

export const LoadableDelibsApp = Loadable({
  loader: () => import('containers/DelibsApp/DelibsApp'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingDelibsApp
});

export const LoadableRusheeProfile = Loadable({
  loader: () => import('containers/DelibsApp/RusheeProfile'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingRusheeProfile
});

export const LoadableDataApp = Loadable({
  loader: () => import('containers/DataApp/DataApp'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingDataApp
});

export const LoadableMeritBook = Loadable({
  loader: () => import('containers/PledgeApp/components/MeritBook/MeritBook'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

export const LoadableContacts = Loadable({
  loader: () => import('containers/PledgeApp/components/Contacts/Contacts'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

export const LoadableChalkboards = Loadable({
  loader: () => import('containers/PledgeApp/components/Chalkboards/Chalkboards'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

export const LoadableComplaints = Loadable({
  loader: () => import('containers/PledgeApp/components/Complaints/Complaints'),
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
