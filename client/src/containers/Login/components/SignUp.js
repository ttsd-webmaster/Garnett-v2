import { formData1, selectData, formData2 } from '../data.js';

import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default function SignUp(props) {
  return (
    <form className="login-form" id="sign-up-form">
      {formData1.map((form, i) => (
        <TextField
          className="login-input"
          type={form.type}
          inputStyle={{color: '#fff'}}
          floatingLabelText={form.name}
          floatingLabelStyle={{color: '#888'}}
          floatingLabelFocusStyle={{color: 'var(--primary-color'}}
          value={props[`${form.value}`]}
          onChange={(e, newValue) => props.handleChange(form.value, newValue)}
          errorText={!props[`${form.value + 'Validation'}`] && form.errorText}
          key={i}
        />
      ))}

      {selectData.map((select, i) => (
        <SelectField
          className="login-input"
          value={props[`${select.value}`]}
          floatingLabelText={select.name}
          floatingLabelStyle={{color: '#888'}}
          labelStyle={{color: '#fff'}}
          onChange={(e, key, newValue) => props.handleChange(select.value, newValue)}
          errorText={!props[`${select.value + 'Validation'}`] && select.errorText}
          key={i}
        >
          {select.options.map((item, i) => (
            <MenuItem
              key={i}
              value={item}
              primaryText={item}
              insetChildren
              checked={item === props[`${select.value}`]}
            />
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
          value={props[`${form.value}`]}
          onChange={(e, newValue) => props.handleChange(form.value, newValue)}
          errorText={!props[`${form.value + 'Validation'}`] && form.errorText}
          key={i}
          onSubmit={props.signUp}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              props.signUp();
              ev.preventDefault();
            }
          }}
        />
      ))}
      
      <div className="login-button" onClick={props.signUp}>
        Sign Up
      </div>
    </form>
  )
}
