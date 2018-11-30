import './MobileMeritDialog.css';
import { MeritCreateAmount } from './MeritCreateAmount';
import { MeritSelectPledges } from './MeritSelectPledges';
import { MeritSelectActives } from './MeritSelectActives';

import React, { PureComponent } from 'react';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const fullscreenDialogStyle = {
  backgroundColor: '#fff'
};

const titleStyle = {
  fontFamily: 'Helvetica Neue',
  fontSize: '18px',
  fontWeight: '500',
  color: 'rgba(0, 0, 0, 0.87)',
  marginRight: '38px',
  letterSpacing: '0.5px',
  textAlign: 'center'
}

const appBarStyle = {
  backgroundColor: '#fff'
}

export default class MobileMeritDialog extends PureComponent {
  state = {
    view: 'amount',
    header: 'Merits',
    isDemerit: false,
    amount: 0
  }

  changeView = (value) => {
    const parsedAmount = parseInt(value, 10);
    let header;

    if (parsedAmount < 0) {
      header = `${value} demerits`;
    }
    else {
      header = `${value} merits`;
    }
    
    this.setState({
      header,
      view: 'selectUsers',
      amount: parseInt(value, 10)
    });
  }

  onClose = () => {
    this.props.handleMeritClose();
    this.setState({
      view: 'amount',
      header: 'Merits',
      amount: 0
    });
  }

  render() {
    return (
      <FullscreenDialog
        title={this.state.header}
        titleStyle={titleStyle}
        appBarStyle={appBarStyle}
        style={fullscreenDialogStyle}
        open={this.props.open}
        onRequestClose={this.onClose}
        appBarZDepth={0}
      >
        {this.state.view === 'amount' && (
          <MeritCreateAmount changeView={this.changeView} />
        )}
        {this.props.state.status === 'pledge' ? (
          <MeritSelectActives
            hidden={this.state.view !== 'selectUsers'}
            state={this.props.state}
            amount={this.state.amount}
            handleRequestOpen={this.props.handleRequestOpen}
            handleClose={this.onClose}
          />
        ) : (
          <MeritSelectPledges
            hidden={this.state.view !== 'selectUsers'}
            state={this.props.state}
            amount={this.state.amount}
            handleRequestOpen={this.props.handleRequestOpen}
            handleClose={this.onClose}
          />
        )}
      </FullscreenDialog>
    )
  }
}
