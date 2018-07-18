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
    this.setState({
      dataSet: rushData[0][1],
      title: rushData[0][0]
    });
  }

  filterData = (value) => {
    this.setState({
      dataSet: rushData[value][1],
      title: rushData[value][0],
      value: value
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
