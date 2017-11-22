import ActiveList from './ActiveList';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

const LoadableContactsDialog = Loadable({
  loader: () => import('./ContactsDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>
  }
});

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classArray: ['Charter', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho'],
      open: false,
      active: null
    }
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
      <List>
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
        <LoadableContactsDialog
          open={this.state.open}
          active={this.state.active}
          handleClose={this.handleClose}
        />
      </List>
    )
  }
}