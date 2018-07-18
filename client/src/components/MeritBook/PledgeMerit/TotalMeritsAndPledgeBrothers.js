import React from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import CountUp from 'react-countup';

export default function TotalMeritsAndPledgeBrothers(props) {
  return (
    <SwipeableBottomSheet
      bodyStyle={{backgroundColor:'#fafafa'}}
      overflowHeight={58}
      marginTop={42}
      open={props.openPbros}
      topShadow={false}
      onChange={props.openBottomSheet}
    >
      <div className="total-merits-container" onClick={() => props.openBottomSheet(true)}> 
        Total Merits: <CountUp className="total-merits" start={props.previousTotalMerits} end={props.totalMerits} useEasing />
      </div>

      <Subheader className="garnett-subheader" onClick={() => props.openBottomSheet(false)}>
        Pledge Brothers
      </Subheader>

      <List className="garnett-list">
        {props.pbros && (
          props.pbros.map((pbro, i) => (
            <div key={i}>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={pbro.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {pbro.firstName} {pbro.lastName} </p>
                }
                secondaryText={
                  <p>
                    {pbro.year}
                    <br />
                    {pbro.major}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="pledge-merits"> {pbro.totalMerits} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))
        )}
      </List>
    </SwipeableBottomSheet>
  )
}
