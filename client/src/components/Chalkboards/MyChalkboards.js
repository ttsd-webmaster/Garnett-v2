import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

// const LoadableApproveComplaintDialog = Loadable({
//   loader: () => import('./ApproveComplaintDialog'),
//   render(loaded, props) {
//     let Component = loaded.default;
//     return <Component {...props}/>;
//   },
//   loading() {
//     return <div> Loading... </div>;
//   }
// });

export default class MyChalkboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedComplaint: null
    };
  }

  handleOpen = (complaint) => {
    if (navigator.onLine) {
      this.setState({
        open: true,
        selectedComplaint: complaint
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
        <List className="pledge-list">
          <Subheader> Upcoming </Subheader>
          {this.props.myUpcomingChalkboards.map((complaint, i) => (
            <div key={i}>
              <Divider className="pledge-divider large" inset={true} />
              <ListItem
                className="pledge-list-item large"
                leftAvatar={<Avatar className="pledge-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="pledge-name"> {complaint.title} </p>
                }
                secondaryText={
                  <p className="complaints-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="complaints-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="pledge-divider large" inset={true} />
            </div>
          ))}

          <Divider />

          <Subheader> Completed </Subheader>
          {this.props.myCompletedChalkboards.map((complaint, i) => (
            <div key={i}>
              <Divider className="pledge-divider large" inset={true} />
              <ListItem
                className="pledge-list-item large"
                leftAvatar={<Avatar className="pledge-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="pledge-name"> {complaint.title} </p>
                }
                secondaryText={
                  <p className="complaints-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => {
                  if (this.props.state.status !== 'active') {
                    this.handleApproveOpen(complaint)
                  }
                }}
              >
                <p className="complaints-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="pledge-divider large" inset={true} />
            </div>
          ))}
        </List>
      </div>
    )
  }
}
