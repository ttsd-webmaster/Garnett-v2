// @flow

import React, { type Node } from 'react';
import { createPortal } from 'react-dom';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

type Props = {
  children: Node,
  open: boolean,
  title: ?string,
  withTabs?: boolean,
  onRequestClose: () => void
};

const titleStyle = {
  fontFamily: "'Helvetica Neue', Roboto, sans-serif",
  fontSize: '18px',
  fontWeight: '500',
  color: '--var(text-color)',
  marginRight: '38px',
  letterSpacing: '0.5px',
  textAlign: 'center'
};

export function FullScreenDialog(props: Props) {
  const { children, open, title, withTabs, onRequestClose } = props;
  return createPortal(
    <div id="fullscreen-dialog">
      <FullscreenDialog
        title={title}
        titleStyle={titleStyle}
        style={{ backgroundColor: 'var(--background-color)' }}
        appBarStyle={{
          backgroundColor: `${
            withTabs ? 'var(--list-color)' : 'var(--background-color)'
          }`
        }}
        appBarZDepth={0}
        open={open}
        onRequestClose={onRequestClose}
      >
        { children }
      </FullscreenDialog>
    </div>,
    document.body
  )
}
