import React from 'react';
import {Chart} from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';
import {Line} from 'react-chartjs-2';
import {Col, List, ListItem, ProgressBar} from 'react-onsenui';

Chart.register (zoomPlugin);

export default class MyChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      showProgressBar: false,
    };
    this.nbChartlines = 0;
    this.range = 0;
  }

  componentDidMount () {
    console.log ('MyChart componentDidMount');
    this.updateChart ();
  }

  componentDidUpdate () {
    console.log ('MyChart componentWillReceiveProps');
    this.updateChart ();
  }

  updateChart () {
    if (this.range === this.props.range) {
      console.log (
        'MyChart updateChart no update needed:' +
          this.range +
          '::' +
          this.props.range
      );
      return;
    }
    console.log (
      'MyChart updateChart update needed:' +
        this.range +
        '::' +
        this.props.range
    );
    this.range = this.props.range;
    console.log ('MyChart updateChart');
    console.log ('MyChart Range: ' + this.props.range);
    // count number og chartlines
    this.nbChartlines = 0;
    for (let i = 1; i < 5; i++) {
      // Runs 4 times, with values of i 1 through 4.
      if (
        (this.props.widgetData.array_chartline &&
          this.props.widgetData.array_chartline[i] &&
          this.props.widgetData.array_chartline[i].enabled &&
          this.props.widgetData.array_chartline[i].enabled === true) ||
        this.props.widgetData.array_chartline[i].enabled === 'true'
      ) {
        this.nbChartlines++;
      }
    }
    // timerange
    let duration = this.props.range * 60 * 1000;

    let options = {
      start: Date.now () - duration,
      end: Date.now (),
      // step: duration / 1920, // for fullHD is sufficinet to have abot 1920 Values
      count: 860, // 2 px per full-HD
      aggregate: 'minmax',
    };
    if (this.nbChartlines > 0) {
      this.props.widgetData.socket.emit (
        'getHistory',
        this.props.widgetData.array_chartline[1].stateId,
        options,
        function (err, result) {
          //console.log('getHistory callback');
          if (err) {
            console.log (err);
            return;
          }
          console.log(result);
          console.log ('getHistory chart 1 length: ' + result.length);
          this.setState ({
            chart1: {
              id: 1,
              label: this.props.widgetData.array_chartline[1].description,
              borderColor: this.props.widgetData.array_chartline[1].color,
              borderWidth: this.props.widgetData.array_chartline[1].lineWidth,
              yAxisID: 'y1',
              data: result,
              stepped: this.props.widgetData.array_chartline[1].stepped,
              showLine: true,
              pointStyle: false,
            },
            showProgressBar: false,
          });
        }.bind (this)
      );
    }
    if (this.nbChartlines > 1) {
      this.props.widgetData.socket.emit (
        'getHistory',
        this.props.widgetData.array_chartline[2].stateId,
        options,
        function (err, result) {
          if (err) {
            console.log (err);
            return;
          }
          //console.log(result);
          console.log ('getHistory chart 2 length: ' + result.length);
          this.setState ({
            chart2: {
              id: 2,
              label: this.props.widgetData.array_chartline[2].description,
              borderColor: this.props.widgetData.array_chartline[2].color,
              borderWidth: this.props.widgetData.array_chartline[2].lineWidth,
              yAxisID: 'y2',
              data: result,
              stepped: this.props.widgetData.array_chartline[2].stepped,
              showLine: true,
              pointStyle: false,
            },
          });
        }.bind (this)
      );
    }
    if (this.nbChartlines > 2) {
      this.props.widgetData.socket.emit (
        'getHistory',
        this.props.widgetData.array_chartline[3].stateId,
        options,
        function (err, result) {
          if (err) {
            console.log (err);
            return;
          }
          //console.log(result);
          //console.log("getHistory length: " + result.length);
          this.setState ({
            chart3: {
              id: 3,
              label: this.props.widgetData.array_chartline[3].description,
              borderColor: this.props.widgetData.array_chartline[3].color,
              borderWidth: this.props.widgetData.array_chartline[3].lineWidth,
              yAxisID: 'y3',
              data: result,
              stepped: this.props.widgetData.array_chartline[3].stepped,
              showLine: true,
              pointStyle: false,
            },
          });
        }.bind (this)
      );
    }
    if (this.nbChartlines > 3) {
      this.props.widgetData.socket.emit (
        'getHistory',
        this.props.widgetData.array_chartline[4].stateId,
        options,
        function (err, result) {
          if (err) {
            console.log (err);
            return;
          }
          //console.log(result);
          //console.log("getHistory length: " + result.length);
          this.setState ({
            chart4: {
              id: 4,
              label: this.props.widgetData.array_chartline[4].description,
              borderColor: this.props.widgetData.array_chartline[4].color,
              borderWidth: this.props.widgetData.array_chartline[4].lineWidth,
              yAxisID: 'y4',
              data: result,
              stepped: this.props.widgetData.array_chartline[4].stepped,
              showLine: true,
              pointStyle: false,
            },
          });
        }.bind (this)
      );
    }
    this.setState ({showProgressBar: true});
  }

  render () {
    console.log ('render MyChart');
    console.log (this.props);
    let chart = null;

    if (this.nbChartlines > 0) {
      // build dataset if all data is received
      let datasets = [];
      if (this.state.chart1 && this.nbChartlines === 1) {
        datasets.push (this.state.chart1);
      }
      if (this.state.chart1 && this.state.chart2 && this.nbChartlines === 2) {
        datasets.push (this.state.chart1);
        datasets.push (this.state.chart2);
        //console.log ('render MyChart 2 datasets completed');
      }
      if (
        this.state.chart1 &&
        this.state.chart2 &&
        this.state.chart3 &&
        this.nbChartlines === 3
      ) {
        datasets.push (this.state.chart1);
        datasets.push (this.state.chart2);
        datasets.push (this.state.chart3);
      }
      if (
        this.state.chart1 &&
        this.state.chart2 &&
        this.state.chart3 &&
        this.state.chart4 &&
        this.nbChartlines === 4
      ) {
        datasets.push (this.state.chart1);
        datasets.push (this.state.chart2);
        datasets.push (this.state.chart3);
        datasets.push (this.state.chart4);
      }

      chart = (
        <div style={{width: 100 + '%', height: this.props.chartHeight + 'px'}}>
          <Line
            height={this.props.chartHeight}
            datasetIdKey="id"
            data={{datasets}}
            options={{
              parsing: {
                xAxisKey: 'ts',
                yAxisKey: 'val',
              },
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                x: {
                  type: 'time',
                  grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                  ticks: {
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                    maxTicksLimit: 20,
                  },
                },
                y1: {
                  position: 'left',
                  display: this.props.widgetData.array_chartline[1].enabled &&
                    this.props.widgetData.array_chartline[1].yAxis,
                  min: this.props.widgetData.array_chartline[1].min,
                  max: this.props.widgetData.array_chartline[1].max,
                  ticks: {
                    callback: function (value, index, ticks) {
                      return (
                        value +
                        ' ' +
                        this.props.widgetData.array_chartline[1].unit
                      );
                    }.bind (this),
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                    maxTicksLimit: 11,
                  },
                  border: {
                    display: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                  grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                },
                y2: {
                  position: 'right',
                  display: this.props.widgetData.array_chartline[2].enabled &&
                    this.props.widgetData.array_chartline[2].yAxis,
                  min: this.props.widgetData.array_chartline[2].min,
                  max: this.props.widgetData.array_chartline[2].max,
                  ticks: {
                    callback: function (value, index, ticks) {
                      return (
                        value +
                        ' ' +
                        this.props.widgetData.array_chartline[2].unit
                      );
                    }.bind (this),
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                    maxTicksLimit: 11,
                  },
                  border: {
                    display: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                  grid: {
                    display: false,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                },
                y3: {
                  position: 'right',
                  display: this.props.widgetData.array_chartline[3].enabled &&
                    this.props.widgetData.array_chartline[3].yAxis,
                  min: this.props.widgetData.array_chartline[3].min,
                  max: this.props.widgetData.array_chartline[3].max,
                  ticks: {
                    callback: function (value, index, ticks) {
                      return (
                        value +
                        ' ' +
                        this.props.widgetData.array_chartline[3].unit
                      );
                    }.bind (this),
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                    maxTicksLimit: 11,
                  },
                  border: {
                    display: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                  grid: {
                    display: false,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                },
                y4: {
                  position: 'left',
                  display: this.props.widgetData.array_chartline[4].enabled &&
                    this.props.widgetData.array_chartline[4].yAxis,
                  min: this.props.widgetData.array_chartline[4].min,
                  max: this.props.widgetData.array_chartline[4].max,
                  ticks: {
                    callback: function (value, index, ticks) {
                      return (
                        value +
                        ' ' +
                        this.props.widgetData.array_chartline[4].unit
                      );
                    }.bind (this),
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                    maxTicksLimit: 11,
                  },
                  border: {
                    display: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                  grid: {
                    display: false,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--chart-grid-color'],
                  },
                },
              },
              animation: {
                duration: 0,
              },
              plugins: {
                title: {
                  display: this.props.widgetData.title.length > 0
                    ? true
                    : false,
                  text: this.props.widgetData.title,
                  position: 'top',
                  align: 'start',
                  padding: {
                    top: 0,
                    bottom: 0,
                  },
                  color: this.props.widgetData.theme.children[':root']
                    .attributes['--text-color'],
                },
                legend: {
                  align: 'end',
                  labels: {
                    color: this.props.widgetData.theme.children[':root']
                      .attributes['--text-color'],
                  },
                },
                zoom: {
                  zoom: {
                    wheel: {
                      enabled: true,
                      modifierKey: 'ctrl',
                    },
                    pan: {
                      enabled: true,
                    },
                    pinch: {
                      enabled: true,
                    },
                    mode: 'xy',
                  },
                },
              },
            }}
          />
        </div>
      );
    }

    let progressBar = (
      <div
        className="mychart-progressbar"
        style={{width: '100%', padding: '3em'}}
      >
        <p className="mychart-progressbar-text">loading data ....</p>
        <ProgressBar indeterminate />
      </div>
    );

    return (
      <Col>
        <List>
          <ListItem>
            {!this.state.showProgressBar && chart ? chart : progressBar}
          </ListItem>
        </List>
      </Col>
    );
  }
}
