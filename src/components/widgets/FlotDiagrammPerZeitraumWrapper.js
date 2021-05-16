import React from "react";
import { Modal, Segment, Button, List, ListItem, ListHeader, Fab } from "react-onsenui";
import FlotDiagrammPerZeitraum from "./FlotDiagrammPerZeitraum";
import moment from "moment";
moment.locale("de-DE");

export default class FlotDiagrammPerZeitraumWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.defaultRange = this.props.widgetData.defaultRange || 1;
    this.timeFormat=["%h:%M", "%h:%M", "%a.", "%d.%m"];
    this.rangeNames=[
      this.props.widgetData.area1Name,
      this.props.widgetData.area2Name,
      this.props.widgetData.area3Name,
      this.props.widgetData.area4Name,
    ];
    this.ranges=[
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
    let flotHeight = height - 80;
    height = height + "px";
    flotHeight = flotHeight + "px";

    console.log("height " + height + " flotHeight " + flotHeight);
    console.log(this.props.widgetData.modalWidgetHeight);

    var flotWidget = (
      <List id={this.props.widgetData.UUID} className="flotoutput" style={{ height }}>
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
        <FlotDiagrammPerZeitraum
          title="NONE"
          FlotUrl={this.props.widgetData.url}
          FlotWidth={this.props.widgetData.FlotWidth || "100%"}
          FlotHeight={flotHeight}
          FlotRange={this.state.range}
          FlotTimeFormat={this.state.timeFormat}
          FlotWindowBG={this.props.widgetData.FlotWindowBG || "282828"}
          FlotZoom={this.props.widgetData.FlotZoom || false}
          FlotHoverDetail={this.props.widgetData.FlotHoverDetail || true}
        />
      </List>
    );

    console.log("showInModal");
    console.log(this.props.widgetData.showInModal);


    if (this.props.widgetData.showInModal === true) {
      return (
        <List className="modalflotoutput" style={{ height }}>
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
              {flotWidget}
            </Modal>
          </ListItem >
        </List >
      );
    } else {
      return flotWidget;
    }
  }
}
