import ActiveList from './ActiveList';
import ContactsDialog from './ContactsDialog';

import React, {Component} from 'react';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

const listStyle = {
  textAlign: 'left'
};

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classArray: [],
      open: false,
      active: null
    }
  }

  componentDidMount() {
    let classArray = ['Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho'];

    this.setState({
      classArray: classArray
    });
  }

  handleOpen = (active) => {
    this.setState({
      open: true,
      active: active
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <List style={listStyle}>
        {this.state.classArray.map((classLabel, i) => (
          <div key={i}>
            <Subheader> {classLabel} </Subheader>
            <ActiveList 
              activeArray={this.props.activeArray} 
              classLabel={classLabel}
              handleOpen={this.handleOpen}
            />
          </div>
        ))}
        <ContactsDialog
          open={this.state.open}
          active={this.state.active}
          handleClose={this.handleClose}
        />
      </List>
    )
  }
}