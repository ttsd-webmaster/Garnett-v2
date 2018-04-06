import '../../MeritBook.css';
import {getTabStyle, isMobileDevice, getDate} from '../../../../helpers/functions.js';
import API from '../../../../api/API.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog'

const activePhoneNumber = {
  display: 'block',
  textDecoration: 'none'
}

const inkBarStyle = {
  position: 'fixed',
  bottom: 'auto',
  marginTop: '46px',
  backgroundColor: 'var(--primary-color)',
  zIndex: 2
};

const LoadableMeritList = Loadable({
  loader: () => import('./MeritList'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

export default class ActiveMerit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledge: null,
      index: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pledge: nextProps.pledge,
      index: nextProps.index
    });
  }

  handleChange = (value) => {
    this.setState({
      index: value
    });
  }

  handleClose = () => {
    this.props.handleClose();

    this.setState({
      index: 0
    });
  }

  render() {
    let pledgeName;

    if (this.state.pledge) {
      pledgeName = `${this.state.pledge.firstName} ${this.state.pledge.lastName}`;
    }

    const actions = [
      <FlatButton
        label="Demerit"
        primary={true}
        onClick={() => this.demerit(this.state.pledge)}
      />,
      <FlatButton
        label="Merit"
        primary={true}
        onClick={() => this.merit(this.state.pledge)}
      />,
    ];

    return (
      this.state.pledge && (
        isMobileDevice() ? (
          <FullscreenDialog
            title={pledgeName}
            open={this.props.open}
            onRequestClose={this.handleClose}
          >
            <Tabs 
              className="garnett-dialog-tabs"
              inkBarStyle={inkBarStyle}
              onChange={this.handleChange}
            >
              <Tab style={getTabStyle(this.state.index === 0)} label="Information" value={0}>
                <img className="chalkboard-photo" src={this.state.pledge.photoURL} alt="User" />
                <List style={{padding:'24px 0'}}>
                  <Divider />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Name"
                    secondaryText={pledgeName}
                    leftIcon={
                      <i className="icon-user garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <a style={activePhoneNumber} href={`tel:${this.state.pledge.phone}`}>
                    <ListItem
                      className="contacts-list-item"
                      primaryText="Phone Number"
                      secondaryText={this.state.pledge.phone}
                      leftIcon={
                        <i className="icon-phone garnett-icon"></i>
                      }
                    />
                  </a>
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Email Address"
                    secondaryText={this.state.pledge.email}
                    leftIcon={
                      <i className="icon-mail-alt garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Major"
                    secondaryText={this.state.pledge.major}
                    leftIcon={
                      <i className="icon-graduation-cap garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" />
                </List>
              </Tab>
              <Tab style={getTabStyle(this.state.index === 1)} label="Past Merits" value={1}>
                <LoadableMeritList pledge={this.state.pledge} />
              </Tab>
            </Tabs>
          </FullscreenDialog>
        ) : (
          <Dialog
            title={pledgeName}
            titleClassName="garnett-dialog-title"
            actions={actions}
            modal={false}
            bodyClassName="garnett-dialog-body tabs grey"
            contentClassName="garnett-dialog-content"
            open={this.props.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <Tabs
              className="garnett-dialog-tabs"
              inkBarStyle={inkBarStyle}
              onChange={this.handleChange}
            >
              <Tab style={getTabStyle(this.state.index === 0)} label="Information" value={0}>
                <List style={{padding:'24px 0'}}>
                  <Divider />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Name"
                    secondaryText={pledgeName}
                    leftIcon={
                      <i className="icon-user garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <a style={activePhoneNumber} href={`tel:${this.state.pledge.phone}`}>
                    <ListItem
                      className="contacts-list-item"
                      primaryText="Phone Number"
                      secondaryText={this.state.pledge.phone}
                      leftIcon={
                        <i className="icon-phone garnett-icon"></i>
                      }
                    />
                  </a>
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Email Address"
                    secondaryText={this.state.pledge.email}
                    leftIcon={
                      <i className="icon-mail-alt garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Major"
                    secondaryText={this.state.pledge.major}
                    leftIcon={
                      <i className="icon-graduation-cap garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" />
                </List>
              </Tab>
              <Tab style={getTabStyle(this.state.index === 1)} label="Past Merits" value={1}>
                <LoadableMeritList pledge={this.state.pledge} />
              </Tab>
            </Tabs>
          </Dialog>
        )
      )
    )
  }
}
