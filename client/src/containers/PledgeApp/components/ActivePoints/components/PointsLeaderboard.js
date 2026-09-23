// @flow

import API from 'api/API.js';
import goldMedal from 'containers/DataApp/components/PledgingData/images/gold.png';
import silverMedal from 'containers/DataApp/components/PledgingData/images/silver.png';
import bronzeMedal from 'containers/DataApp/components/PledgingData/images/bronze.png';
import { setRefresh } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders';
import type { User, LeaderboardEntry } from 'api/models';

import React, { PureComponent, type Node } from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

type Props = {
  state: User,
  isAdmin: boolean,
  openBreakdown: (string) => void,
  handleRequestOpen: (string) => void
};

type State = {
  leaderboard: ?Array<LeaderboardEntry>
};

export class PointsLeaderboard extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const leaderboard = JSON.parse(localStorage.getItem('pointsLeaderboard'));
    this.state = { leaderboard };
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(this.fetchLeaderboard);
      this.fetchLeaderboard();
    }
  }

  // Only the top three get a medal, matching the pledge leaderboard
  medal(index: number): ?Node {
    switch (index) {
      case 0:
        return <img className="medal" src={goldMedal} alt="Gold medal" />;
      case 1:
        return <img className="medal" src={silverMedal} alt="Silver medal" />;
      case 2:
        return <img className="medal" src={bronzeMedal} alt="Bronze medal" />;
      default:
    }
  }

  fetchLeaderboard = () => {
    const { displayName } = this.props.state;

    API.getPointsLeaderboard(displayName)
    .then((res) => {
      const { leaderboard } = res.data;
      localStorage.setItem('pointsLeaderboard', JSON.stringify(leaderboard));
      this.setState({ leaderboard });
    })
    .catch((error) => {
      console.error(error);
      this.props.handleRequestOpen('Could not load the leaderboard.');
    });
  }

  render() {
    const { isAdmin, openBreakdown } = this.props;
    const { leaderboard } = this.state;

    if (!leaderboard) {
      return <LoadingComponent />
    }

    if (leaderboard.length === 0) {
      return (
        <div className="no-items-container">
          <h1 className="no-items-found">No actives found</h1>
        </div>
      )
    }

    return (
      <List id="points-leaderboard" className="animate-in garnett-list">
        {leaderboard.map((entry, i) => (
          <div key={entry.name}>
            <Divider className="garnett-divider large" inset={true} />
            <ListItem
              className="garnett-list-item large"
              leftAvatar={
                <Avatar
                  className="garnett-image large"
                  size={70}
                  src={entry.photoURL}
                />
              }
              primaryText={
                <p className="garnett-name">
                  <span className="points-rank">{ i + 1 }.</span>
                  { entry.name }
                </p>
              }
              secondaryText={
                <p className="garnett-description">
                  { entry.instances } { entry.instances === 1 ? 'award' : 'awards' }
                </p>
              }
              secondaryTextLines={2}
              // Only admins get the detailed per active breakdown
              onClick={() => isAdmin && openBreakdown(entry.name)}
            >
              { this.medal(i) }
              <p className="pledge-merits">{ entry.total }</p>
            </ListItem>
            <Divider className="garnett-divider large" inset={true} />
          </div>
        ))}
      </List>
    )
  }
}
