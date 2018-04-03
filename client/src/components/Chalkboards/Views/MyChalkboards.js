import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class MyChalkboards extends Component {
  render() {
    return (
      <div id="my-chalkboards" className="active">
        {this.props.state.status !== 'pledge' && (
          <div>
            <Subheader className="garnett-subheader"> Hosting </Subheader>
            <List className="garnett-list">
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
            </List>

            <Divider className="garnett-subheader" />
          </div>
        )}

        <Subheader className="garnett-subheader"> Attending </Subheader>
        <List className="garnett-list">
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
        </List>

        <Divider className="garnett-subheader" />

        <Subheader className="garnett-subheader"> Completed </Subheader>
        <List className="garnett-list">
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
