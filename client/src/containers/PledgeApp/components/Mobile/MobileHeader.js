import React, { Fragment } from 'react';
import CountUp from 'react-countup';

export function MobileHeader(props) {
  let header;
  switch (props.index) {
    case 0:
      header = (
        <Fragment>
          <CountUp
            className="total-merits"
            start={props.previousTotalMerits}
            end={props.totalMerits}
            useEasing
          />
          <span>
            merits {props.status !== 'pledge' && 'merited'}
          </span>
        </Fragment>
      )
      break;
    case 1:
      if (props.status === 'pledge') {
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
    <div className="total-merits-container">
      {header}
    </div>
  )
}
