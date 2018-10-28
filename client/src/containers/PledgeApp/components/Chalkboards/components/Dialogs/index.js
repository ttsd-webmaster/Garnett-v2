import React from 'react';
import Loadable from 'react-loadable';

export const LoadableAddChalkboardDialog = Loadable({
  loader: () => import('./AddChalkboardDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export const LoadableHandleChalkboardDialog = Loadable({
  loader: () => import('./HandleChalkboardDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export const LoadableAttendeeList = Loadable({
  loader: () => import('./AttendeeList'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export const LoadableEditChalkboardMobileDialog = Loadable({
  loader: () => import('./EditChalkboardMobileDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export const LoadableEditChalkboardDialog = Loadable({
  loader: () => import('./EditChalkboardDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});
