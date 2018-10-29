import API from 'api/API.js';

import React, { PureComponent } from 'react';
import Checkbox from 'material-ui/Checkbox';

const labelStyle = {
  left: '-8px',
  width: 'auto'
};

export class InteractedCheckbox extends PureComponent {
  updateInteraction = (rushee) => {
    const { displayName } = this.props.state;
    const rusheeName = rushee.name.replace(/ /g,'');
    const { interacted } = rushee;
    const { totalInteractions } = rushee;

    API.updateInteraction(displayName, rusheeName, interacted, totalInteractions)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
  }

  handleClickCapture(event) {
    event.stopPropagation();
  }

  render() {
    return (
      <div className="checkbox-container" onClickCapture={this.handleClickCapture}>
        <Checkbox
          className="interactedCheckbox"
          label="Met"
          labelStyle={labelStyle}
          checked={this.props.rushee.interacted}
          onCheck={() => this.updateInteraction(this.props.rushee)}
        />
        <p className="interactedCount"> {this.props.rushee.totalInteractions} </p>
      </div>
    )
  }
}