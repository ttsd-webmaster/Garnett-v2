import rushData from '../data/rushData.json';
import Filter from '../Components/Filter.js';
import Chart from '../Components/Chart.js';

import React, {Component} from 'react';
import Paper from 'material-ui/Paper';

export default class RushData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: [],
      title: '',
      value: 0,
      loaded: false, 
    }
  }

  componentDidMount() {
    let dataSet = rushData[0][1];
    let title = rushData[0][0];

    this.setState({
      dataSet,
      title
    });
  }

  filterData = (value) => {
    let dataSet = rushData[value][1];
    let title = rushData[value][0];
    this.setState({
      dataSet,
      title,
      value
    })
  }

  render() {
    return (
      <div id="rush-data">
        <div className="filter">
          <Filter value={this.state.value} filterData={this.filterData} />
        </div>
        <Paper className="graph">
          <Chart
            dataSet={this.state.dataSet}
            title={this.state.title}
          />
        </Paper>
      </div>
    )
  }
}
