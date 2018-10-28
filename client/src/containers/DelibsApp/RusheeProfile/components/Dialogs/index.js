import React from 'react';
import Loadable from 'react-loadable';

export const LoadableEndVoteDialog = Loadable({
  loader: () => import('./EndVoteDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export const LoadableVoteDialog = Loadable({
  loader: () => import('./VoteDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export const LoadableResourceDialog = Loadable({
  loader: () => import('./ResourceDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});

export const LoadableInterviewDialog = Loadable({
  loader: () => import('./InterviewDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div></div>;
  }
});
