import './RushData.css';
import rushData from './data/rushData.json';
import Filter from './components/Filter.js';
import Chart from './components/Chart.js';

import React, { PureComponent } from 'react';

export class RushData extends PureComponent {
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

    this.setState({ dataSet, title });
  }

  filterData = (value) => {
    let dataSet = rushData[value][1];
    let title = rushData[value][0];
    this.setState({ dataSet, title, value })
  }

  render() {
    return (
      <div id="rush-data">
        <Filter value={this.state.value} filterData={this.filterData} />
        <Chart dataSet={this.state.dataSet} title={this.state.title} />
      </div>
    )
  }
}
