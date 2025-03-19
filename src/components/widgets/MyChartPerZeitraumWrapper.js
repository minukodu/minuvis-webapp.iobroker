import React from "react";
import { Modal, Segment, Button, List, ListItem, ListHeader, Fab } from "react-onsenui";
import MyChart from "./MyChart";
import moment from "moment";
moment.locale("de-DE");

export default class MyChartPerZeitraumWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.defaultRange = this.props.widgetData.defaultRange || 1;
    this.timeFormat = ["%h:%M", "%h:%M", "%a.", "%d.%m"];
    this.rangeNames = [
      this.props.widgetData.area1Name,
      this.props.widgetData.area2Name,
      this.props.widgetData.area3Name,
      this.props.widgetData.area4Name,
    ];
    this.ranges = [
      this.props.widgetData.area1Time,
      this.props.widgetData.area2Time,
      this.props.widgetData.area3Time,
      this.props.widgetData.area4Time,
    ];
    this.state = {
      range: this.ranges[this.defaultRange],
      timeFormat: this.timeFormat[this.defaultRange],
      periodName: this.rangeNames[this.defaultRange],
      showModal: false,
    };
  }

  setRange1() {
    this.setState({
      range: this.ranges[0],
      timeFormat: this.timeFormat[0],
      rangeName: this.rangeNames[0],
    });
  }
  setRange2() {
    this.setState({
      range: this.ranges[1],
      timeFormat: this.timeFormat[1],
      rangeName: this.rangeNames[1],
    });
  }
  setRange3() {
    this.setState({
      range: this.ranges[2],
      timeFormat: this.timeFormat[2],
      rangeName: this.rangeNames[2],
    });
  }
  setRange4() {
    this.setState({
      range: this.ranges[3],
      timeFormat: this.timeFormat[3],
      rangeName: this.rangeNames[3],
    });
  }

  showModal() {
    this.setState({ showModal: true });
  }
  hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    let timestamp = null;
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{ float: "right", paddingRight: "5px" }}
          >
            {moment().format("DD.MM.YY HH:mm")}
          </span>
        </ListHeader>
      );
    }

    let widgetHeight = this.props.widgetData.widgetHeight;

    if (this.props.widgetData.showInModal === true) {
      // minus 2 or minimum 2
      widgetHeight = this.props.widgetData.modalWidgetHeight > 2 ? this.props.widgetData.modalWidgetHeight - 2 : 2;
    };

    let height = widgetHeight * this.props.widgetData.rowHeight;
    let chartHeight = height - 80;
    height = height + "px";

    console.log("height " + height + " chartHeight " + chartHeight);
    console.log(this.props.widgetData.modalWidgetHeight);

    var chartWidget = (
      <List id={this.props.widgetData.UUID} className="chartoutput" style={{ height }}>
        {timestamp}
        <ListItem>
          <Segment
            index={this.defaultRange}
            disable-auto-styling
            style={{ marginLeft: "5%", width: "90%" }}
          >
            <Button
              disable-auto-styling
              onClick={this.setRange1.bind(this)}
            >
              {this.rangeNames[0]}
            </Button>
            <Button
              disable-auto-styling
              onClick={this.setRange2.bind(this)}
            >
              {this.rangeNames[1]}
            </Button>
            <Button
              disable-auto-styling
              onClick={this.setRange3.bind(this)}
            >
              {this.rangeNames[2]}
            </Button>
            <Button
              disable-auto-styling
              onClick={this.setRange4.bind(this)}
            >
              {this.rangeNames[3]}
            </Button>
          </Segment>
        </ListItem>
        <MyChart
          key={this.state.range}
          widgetData={this.props.widgetData}
          range={this.state.range}
          chartHeight={chartHeight}
        />
      </List>
    );

    console.log("showInModal");
    console.log(this.props.widgetData.showInModal);


    if (this.props.widgetData.showInModal === true) {
      return (
        <List className="modalchartoutput" style={{ height }}>
          <ListItem>
            <div className="center">
              <div className="centerFab" style={{ margin: "auto" }}>
                <Fab
                  mini
                  className="fab--mini"
                  onClick={this.showModal.bind(this)}>
                  <i className="mdi-icon chart-areaspline fab--mini--icon" />
                </Fab>
              </div>
            </div>
            <Modal isOpen={this.state.showModal}>
              <List className="iconbar">
                <ListItem>
                  <div className="right">
                    <Fab
                      mini
                      className="fab--mini"
                      modifier="material"
                      onClick={this.hideModal.bind(this)}>
                      <i className="mdi-icon window-close fab--mini--icon" />
                    </Fab>
                  </div>
                </ListItem>
              </List>
              {chartWidget}
            </Modal>
          </ListItem >
        </List >
      );
    } else {
      return chartWidget;
    }
  }
}
