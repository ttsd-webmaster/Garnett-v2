// @flow

import React from 'react';

type Props = {
  title: string,
  src: string,
  goTo: () => void
};

export function GarnettApp(props: Props) {
  return (
    <div className="app-icon" onClick={props.goTo}>
      <div className="app-icon-image-container">
        <img
          className="app-icon-image"
          src={props.src}
          alt={props.title}
        />
      </div>
      <p>{ props.title }</p>
    </div>
  )
}
