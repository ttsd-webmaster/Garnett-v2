import '../../MeritBook.css';
import {getTabStyle, isMobileDevice} from 'helpers/functions.js';
import API from 'api/API.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

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

const LoadableMeritsList = Loadable({
  loader: () => import('./MeritsList'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

const LoadableComplaintsList = Loadable({
  loader: () => import('./ComplaintsList'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

export default class PledgeInfoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledge: null,
      pledgeName: null,
      index: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pledge) {
      const pledgeName = `${this.state.pledge.firstName} ${this.state.pledge.lastName}`;
      const pledgeDisplayName = nextProps.pledge.firstName + nextProps.pledge.lastName;

      this.setState({
        pledge: nextProps.pledge,
        pledgeName,
        pledgeDisplayName,
        index: 0
      });

      if (navigator.onLine) {
        const { displayName } = nextProps.state;

        API.getMeritsRemaining(displayName, pledgeName)
        .then((res) => {
          const meritsRemaining = res.data;

          this.setState({ meritsRemaining });
        });
      }
      else {
        this.setState({ meritsRemaining: 0 });
      }
    }
  }

  handleChange = (value) => {
    this.setState({
      index: value
    });
  }

  render() {
    const actions = (
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />
    );

    return (
      this.state.pledge && (
        isMobileDevice() ? (
          <FullscreenDialog
            title="Pledge"
            titleStyle={{fontSize:'22px'}}
            open={this.props.open}
            onRequestClose={this.props.handleClose}
          >
            <Tabs 
              className="garnett-dialog-tabs"
              inkBarStyle={inkBarStyle}
              onChange={this.handleChange}
            >
              <Tab style={getTabStyle(this.state.index === 0)} label="Info" value={0}>
                <div style={{padding:'15px 0'}}>
                  <img className="dialog-photo" src={this.state.pledge.photoURL} alt="User" />
                </div>
                <List>
                  <Divider />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Name"
                    secondaryText={this.state.pledgeName}
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
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Merits Remaining"
                    secondaryText={`${this.state.meritsRemaining} merits`}
                    leftIcon={
                      <i className="icon-star garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" />
                </List>
              </Tab>
              <Tab style={getTabStyle(this.state.index === 1)} label="Merits" value={1}>
                <LoadableMeritsList
                  pledgeName={this.state.pledgeDisplayName}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              </Tab>
              <Tab style={getTabStyle(this.state.index === 2)} label="Complaints" value={2}>
                <LoadableComplaintsList
                  pledgeName={this.state.pledgeDisplayName}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              </Tab>
            </Tabs>
          </FullscreenDialog>
        ) : (
          <Dialog
            title="Pledge"
            titleClassName="garnett-dialog-title"
            actions={actions}
            modal={false}
            bodyClassName="garnett-dialog-body tabs grey"
            contentClassName="garnett-dialog-content"
            open={this.props.open}
            onRequestClose={this.props.handleClose}
            autoScrollBodyContent={true}
          >
            <Tabs
              className="garnett-dialog-tabs"
              inkBarStyle={inkBarStyle}
              onChange={this.handleChange}
            >
              <Tab style={getTabStyle(this.state.index === 0)} label="Info" value={0}>
                <div style={{padding:'15px 0'}}>
                  <img className="dialog-photo" src={this.state.pledge.photoURL} alt="User" />
                </div>
                <List>
                  <Divider />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Name"
                    secondaryText={this.state.pledgeName}
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
                  <Divider className="garnett-divider" inset={true} />
                  <ListItem
                    className="garnett-list-item"
                    primaryText="Merits Remaining"
                    secondaryText={`${this.state.meritsRemaining} merits`}
                    leftIcon={
                      <i className="icon-star garnett-icon"></i>
                    }
                  />
                  <Divider className="garnett-divider" />
                </List>
              </Tab>
              <Tab style={getTabStyle(this.state.index === 1)} label="Merits" value={1}>
                <LoadableMeritsList
                  pledgeName={this.state.pledgeDisplayName}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              </Tab>
              <Tab style={getTabStyle(this.state.index === 2)} label="Complaints" value={2}>
                <LoadableComplaintsList
                  pledgeName={this.state.pledgeDisplayName}
                  handleRequestOpen={this.props.handleRequestOpen}
                />
              </Tab>
            </Tabs>
          </Dialog>
        )
      )
    )
  }
}
