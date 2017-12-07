import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ActiveList extends Component {
  render() {
    return (
      <div id="submit-complaints" className="active">
        <div id="active-complaints-container">
          <SelectField
            className="complaints-input"
            value={this.props.pledge}
            floatingLabelText="Pledge Name"
            onChange={(e, key, newValue) => this.props.handleChange('pledge', newValue)}
            errorText={!this.props.pledgeValidation && 'Please select a pledge.'}
          >
            {this.props.pledgeArray.map((pledge, i) => (
              <MenuItem key={i} value={pledge} primaryText={pledge.label} />
            ))}
          </SelectField>
          <TextField
            className="complaints-input"
            type="text"
            floatingLabelText="Description"
            multiLine={true}
            rowsMax={3}
            value={this.props.description}
            onChange={(e, newValue) => this.props.handleChange('description', newValue)}
            errorText={!this.props.descriptionValidation && 'Enter a description.'}
          />
          
          <div className="complain-button" onClick={() => this.props.complain(this.props.pledge)}> 
            Submit Complaint
          </div>
        </div>
      </div>
    )
  }
}
