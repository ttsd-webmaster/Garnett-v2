import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ActiveList extends Component {
  componentDidUpdate() {
    let contentContainer = document.querySelector('.content-container');
    let view = document.getElementById('submit-complaints');
    let index = 3;

    if (view.classList.contains('active')) {
      contentContainer.childNodes[index].style.marginBottom = 0;
    }
  }

  render() {
    return (
      <div id="submit-complaints" className="active">
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
        <div style={{height: '60px'}}></div>
        <div className="complain-button" onClick={() => this.props.complain(this.props.pledge)}> 
          Submit Complaint
        </div>
      </div>
    )
  }
}
