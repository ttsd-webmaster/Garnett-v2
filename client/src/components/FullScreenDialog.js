// @flow

import React, { type Node } from 'react';
import { createPortal } from 'react-dom';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

type Props = {
  children: Node,
  open: boolean,
  title: ?string,
  titleStyle: ?Object,
  appBarStyle: ?Object,
  appBarZDepth: ?number,
  onRequestClose: () => void
};

export function FullScreenDialog(props: Props) {
  const {
    children,
    open,
    title,
    titleStyle,
    appBarStyle,
    appBarZDepth,
    onRequestClose
  } = props;
  return createPortal(
    <div id="fullscreen-dialog">
      <FullscreenDialog
        title={title}
        titleStyle={titleStyle || { fontSize: '22px' }}
        style={{ backgroundColor: 'var(--background-color)' }}
        appBarStyle={appBarStyle}
        appBarZDepth={appBarZDepth}
        open={open}
        onRequestClose={onRequestClose}
      >
        { children }
      </FullscreenDialog>
    </div>,
    document.body
  )
}
