// @flow

import React from 'react';
import Chip from 'material-ui/Chip';
import type { MeritType } from 'api/models';

const MERIT_OPTIONS = [
  { type: 'pc', label: 'Price Center' },
  { type: 'personal', label: 'Personal' },
  { type: 'chalkboard', label: 'Chalkboard' }
];

type Props = {
  isMobile: boolean,
  type: MeritType,
  setType: (MeritType) => void 
};

export function MeritTypeOptions(props: Props) {
  const containerName = props.isMobile ? 'mobile-create-amount' : 'create-amount';
  return (
    <div className={`chips-container ${containerName}`}>
      {MERIT_OPTIONS.map((option) => (
        <Chip
          key={option.type}
          className={`garnett-chip merit-dialog ${option.type === props.type ? 'active' : ''}`}
          onClick={() => props.setType(option.type)}
        >
          { option.label }
        </Chip>
      ))}
    </div>
  )  
}
