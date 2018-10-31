import React, { Fragment } from 'react';
import CountUp from 'react-countup';

export function MobileHeader({
  index,
  totalMerits,
  previousTotalMerits,
  status
}) {
  let header;
  switch (index) {
    case 0:
      header = (
        <Fragment>
          <CountUp
            className="total-merits"
            start={previousTotalMerits}
            end={totalMerits}
            useEasing
          />
          <span>
            merits {status !== 'pledge' && 'merited'}
          </span>
        </Fragment>
      )
      break;
    case 1:
      if (status === 'pledge') {
        header = "Pledge Brothers"
      } else {
        header = "Pledges"
      }
      break;
    case 2:
      header = "Brothers"
      break;
    case 3:
      header = "Settings"
      break;
    default:
  }

  return (
    <div id="mobile-header">
      {header}
    </div>
  )
}
