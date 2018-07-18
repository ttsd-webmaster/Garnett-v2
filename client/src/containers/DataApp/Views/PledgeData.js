import pledgeData from '../data/pledgeData.json';

import React from 'react';
import Avatar from 'material-ui/Avatar';
import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default function PledgeData(props) {
  return (
    <div id="pledge-data" className="active">
      {pledgeData.map((set, i) => (
        <div className="data-card" key={i}>
          <div className="data-title"> {set[0]} </div>
          {[...new Map(set[1])].map((entry, j) => (
            <div key={j}>
              <Divider className="garnett-divider pledge-data" inset={true} />
              <ListItem
                className="garnett-list-item pledge-data"
                leftAvatar={<Avatar className="garnett-image" size={60} src={props.photoMap.get(entry[0])} />}
                primaryText={
                  <p className="data-key"> {entry[0]} </p>
                }
              >
                <p className="data-value"> {entry[1]} </p>
              </ListItem>
              <Divider className="garnett-divider pledge-data" inset={true} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
