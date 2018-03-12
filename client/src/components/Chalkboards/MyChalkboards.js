import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class MyChalkboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedchalkboard: null
    };
  }

  handleOpen = (chalkboard) => {
    if (navigator.onLine) {
      this.setState({
        open: true,
        selectedchalkboard: chalkboard
      });
    }
    else {
      this.handleRequestOpen('You are offline.');
    }
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div id="my-chalkboards" className="active">
        <List className="garnett-list">
          {this.props.state.status !== 'pledge' && (
            <div>
              <Subheader> Hosting </Subheader>
              {this.props.myHostingChalkboards.map((chalkboard, i) => (
                <div key={i}>
                  <Divider className="garnett-divider large" inset={true} />
                  <ListItem
                    className="garnett-list-item large"
                    leftAvatar={<Avatar className="garnett-image large" size={70} src={chalkboard.photoURL} />}
                    primaryText={
                      <p className="garnett-name"> {chalkboard.title} </p>
                    }
                    secondaryText={
                      <p className="garnett-description">
                        {chalkboard.description}
                      </p>
                    }
                    secondaryTextLines={2}
                    onClick={() => this.props.handleOpen(chalkboard, 'hosting')}
                  >
                    <p className="garnett-date"> {chalkboard.date} </p>
                  </ListItem>
                  <Divider className="garnett-divider large" inset={true} />
                </div>
              ))}

              <Divider />
            </div>
          )}

          <Subheader> Attending </Subheader>
          {this.props.myAttendingChalkboards.map((chalkboard, i) => (
            <div key={i}>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={chalkboard.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {chalkboard.title} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {chalkboard.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.props.handleOpen(chalkboard, 'attending')}
              >
                <p className="garnett-date"> {chalkboard.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))}

          <Divider />

          <Subheader> Completed </Subheader>
          {this.props.myCompletedChalkboards.map((chalkboard, i) => (
            <div key={i}>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={chalkboard.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {chalkboard.title} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {chalkboard.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.props.handleOpen(chalkboard, 'completed')}
              >
                <p className="garnett-date"> {chalkboard.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))}
        </List>
      </div>
    )
  }
}
