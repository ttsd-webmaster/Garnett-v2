import API from 'api/API.js';
import { LoadingComponent } from 'helpers/loaders.js';

import React, { Component, Fragment } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export class PledgeBrothers extends Component {
  state = { pbros: this.props.pbros }

  componentDidMount() {
    if (navigator.onLine) {
      API.getPbros()
      .then(res => {
        localStorage.setItem('pbros', JSON.stringify(res.data));

        this.setState({
          pbros: res.data
        });
      })
      .catch(error => console.log(`Error: ${error}`));
    }
  }

  render() {
    return (
      this.state.pbros ? (
        <Fragment>
          <Subheader className="garnett-subheader">
            Pledge Brothers
          </Subheader>

          <List className="garnett-list">
            {this.state.pbros && (
              this.state.pbros.map((pbro, i) => (
                <div key={i}>
                  <Divider className="garnett-divider large" inset={true} />
                  <ListItem
                    className="garnett-list-item large"
                    leftAvatar={<Avatar className="garnett-image large" size={70} src={pbro.photoURL} />}
                    primaryText={
                      <p className="garnett-name"> {pbro.firstName} {pbro.lastName} </p>
                    }
                    secondaryText={
                      <p>
                        {pbro.year}
                        <br />
                        {pbro.major}
                      </p>
                    }
                    secondaryTextLines={2}
                  >
                    <p className="pledge-merits"> {pbro.totalMerits} </p>
                  </ListItem>
                  <Divider className="garnett-divider large" inset={true} />
                </div>
              ))
            )}
          </List>
        </Fragment>
      ) : (
        <LoadingComponent />
      )
    )
  }
}
