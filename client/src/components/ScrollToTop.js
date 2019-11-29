import React from 'react';
import { withRouter } from 'react-router-dom';
import { scrollToTop } from 'helpers/functions';

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    const { pathname } = this.props.location;
    if (pathname !== prevProps.location.pathname) {
      scrollToTop(pathname);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
