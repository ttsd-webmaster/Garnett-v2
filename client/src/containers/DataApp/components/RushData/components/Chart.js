// @flow

import React , { PureComponent } from 'react';
import { Bar } from 'react-chartjs-2';
import Paper from 'material-ui/Paper';

type Props = {
  dataSet: Array<any>,
  title: string
};

type State = {
  nameLabels: Array<string>,
  data: Array<any>
};

export default class Chart extends PureComponent<Props, State> {
  state = {
    nameLabels: [],
    data: []
  };

  componentWillReceiveProps(nextProps: Props) {
    const nameLabels = nextProps.dataSet.map(element => element[0]);
    const data = nextProps.dataSet.map(element => element[1]);

    if (JSON.stringify(this.props.dataSet) !== JSON.stringify(nextProps.dataSet)) {
      this.setState({ nameLabels, data });
    }
  }

  render() {
    return (
      <Paper className="graph">
        <Bar
          data={{ labels: this.state.nameLabels,
            datasets: [{
              data: this.state.data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
              ],
              borderWidth: 1
            }]
          }}
          options={{
            title: {
              display: true,
              text: this.props.title
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                ticks: {
                  autoSkip: false
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  userCallback: function(label, index, labels) {
                    // when the floored value is the same as the value we have a whole number
                    if (Math.floor(label) === label) {
                      return label;
                    }
                  }
                }
              }]
            },
            events: false,
            tooltips: {
                enabled: false
            },
            hover: {
                animationDuration: 0
            },
            animation: {
              duration: 1,
              onComplete: function() {
                var chartInstance = this.chart,
                    ctx = chartInstance.ctx;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function (dataset, i) {
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function (bar, index) {
                    var data = dataset.data[index];                            
                    ctx.fillText(data, bar._model.x, bar._model.y - 5);
                  });
                });
              }
            }
          }}
        />
      </Paper>
    )
  }
}
