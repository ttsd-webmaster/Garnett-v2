import {formData1, selectData, formData2} from './data.js';

import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class SignUp extends Component {
  render() {
    return (
      <form className="login-form sign-up" id="sign-up-form">
        {formData1.map((form, i) => (
          <TextField
            className="login-input"
            type={form.type}
            inputStyle={{color: '#fff'}}
            floatingLabelText={form.name}
            floatingLabelStyle={{color: '#888'}}
            floatingLabelFocusStyle={{color: 'var(--primary-color'}}
            value={this.props[`${form.value}`]}
            onChange={(e, newValue) => this.handleChange(form.value, newValue)}
            errorText={!this.props[`${form.value + 'Validation'}`] && form.errorText}
            key={i}
          />
        ))}

        {selectData.map((select, i) => (
          <SelectField
            className="login-input"
            value={this.props[`${select.value}`]}
            floatingLabelText={select.name}
            floatingLabelStyle={{color: '#888'}}
            labelStyle={{color: '#fff'}}
            onChange={(e, key, newValue) => this.props.handleChange(select.value, newValue)}
            errorText={!this.props[`${select.value + 'Validation'}`] && select.errorText}
            key={i}
          >
            {select.options.map((item, i) => (
              <MenuItem key={i} value={item} primaryText={item} />
            ))}
          </SelectField>
        ))}

        {formData2.map((form, i) => (
          <TextField
            className="login-input"
            type={form.type}
            inputStyle={{color: '#fff'}}
            floatingLabelText={form.name}
            floatingLabelStyle={{color: '#888'}}
            floatingLabelFocusStyle={{color: 'var(--primary-color'}}
            value={this.props[`${form.value}`]}
            onChange={(e, newValue) => this.props.handleChange(form.value, newValue)}
            errorText={!this.props[`${form.value + 'Validation'}`] && form.errorText}
            key={i}
            onSubmit={this.props.signUp}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                this.props.signUp();
                ev.preventDefault();
              }
            }}
          />
        ))}
        <div className="login-button" onClick={this.props.signUp}>
          Sign Up
        </div>
      </form>
    )
  }
}
