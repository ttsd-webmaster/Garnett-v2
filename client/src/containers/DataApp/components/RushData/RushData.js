// @flow

import rushData from './data/rushData.json';
import Filter from './components/Filter';
import Chart from './components/Chart';

import React, { PureComponent } from 'react';

type State = {
  dataSet: Array<any>,
  title: string,
  value: number,
  loaded: boolean
};

export class RushData extends PureComponent<{}, State> {
  state = {
    dataSet: [],
    title: '',
    value: 0,
    loaded: false
  };

  componentDidMount() {
    const dataSet = rushData[0][1];
    const title = rushData[0][0];
    this.setState({ dataSet, title });
  }

  filterData = (value: string) => {
    const dataSet = rushData[value][1];
    const title = rushData[value][0];
    this.setState({ dataSet, title, value })
  }

  render() {
    return (
      <div id="rush-data-container">
        <Filter value={this.state.value} filterData={this.filterData} />
        <Chart dataSet={this.state.dataSet} title={this.state.title} />
      </div>
    )
  }
}
