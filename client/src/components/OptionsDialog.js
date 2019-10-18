// @flow

import React, { Fragment } from 'react';
import { BottomSheet } from 'helpers/BottomSheet';
import { isMobile } from 'helpers/functions';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';

type Props = {
  open: boolean,
  options: Array<Object>,
  onClick: Function,
  handleClose: () => void
};

export function OptionsDialog(props: Props) {
  const body = (
    <Fragment>
      {props.options.map((option, i) => (
        <Fragment key={option.header}>
          <List>
            <Subheader>{option.header}</Subheader>
            {option.choices.map((option) => (
              <ListItem
                key={option.text}
                leftIcon={option.icon && <FontIcon className={option.icon} />}
                primaryText={option.text}
                hoverColor="var(--hover-color)"
                onClick={() => option.onClick ? option.onClick() : props.onClick(option)}
              />
            ))}
          </List>
          {props.options.length !== i + 1 && (
            <Divider className="garnett-divider" />
          )}
        </Fragment>
      ))}
    </Fragment>
  )

  if (isMobile()) {
    return (
      <BottomSheet
        open={props.open}
        onRequestClose={props.handleClose}
      >
        { body }
      </BottomSheet>
    )
  }
  return (
    <Dialog
      contentClassName="garnett-dialog-content"
      open={props.open}
      onRequestClose={props.handleClose}
      autoScrollBodyContent={true}
    >
      { body }
    </Dialog>
  )
}
