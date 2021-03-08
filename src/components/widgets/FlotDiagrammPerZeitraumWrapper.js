import React from "react";
import { Modal, Segment, Button, List, ListItem, ListHeader, Fab } from "react-onsenui";
import FlotDiagrammPerZeitraum from "./FlotDiagrammPerZeitraum";
import moment from "moment";
moment.locale("de-DE");

export default class FlotDiagrammPerZeitraumWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: this.props.ranges[this.props.defaultRange],
      timeFormat: this.props.timeFormat[this.props.defaultRange],
      periodName: this.props.rangeNames[this.props.defaultRange],
      showModal: false,
    };
  }

  setRange1() {
    this.setState({
      range: this.props.ranges[0],
      timeFormat: this.props.timeFormat[0],
      rangeName: this.props.rangeNames[0],
    });
  }
  setRange2() {
    this.setState({
      range: this.props.ranges[1],
      timeFormat: this.props.timeFormat[1],
      rangeName: this.props.rangeNames[1],
    });
  }
  setRange3() {
    this.setState({
      range: this.props.ranges[2],
      timeFormat: this.props.timeFormat[2],
      rangeName: this.props.rangeNames[2],
    });
  }
  setRange4() {
    this.setState({
      range: this.props.ranges[3],
      timeFormat: this.props.timeFormat[3],
      rangeName: this.props.rangeNames[3],
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
    if (this.props.timestamp && this.props.timestamp === true) {
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

    let widgetHeight = this.props.widgetHeight;

    if (this.props.showInModal === true) {
      // minus 2 or minimum 2
      widgetHeight = this.props.modalWidgetHeight > 2 ? this.props.modalWidgetHeight - 2 : 2;
    };

    let height = widgetHeight * this.props.rowHeight;
    let flotHeight = height - 80;
    height = height + "px";
    flotHeight = flotHeight + "px";

    console.log("height " + height + " flotHeight " + flotHeight);
    console.log(this.props.modalWidgetHeight);

    var flotWidget = (
      <List id={this.props.UUID} className="flotoutput" style={{ height }}>
        {timestamp}
        <ListItem>
          <Segment
            index={this.props.defaultRange}
            disable-auto-styling
            style={{ marginLeft: "5%", width: "90%" }}
          >
            <Button
              disable-auto-styling
              onClick={this.setRange1.bind(this)}
            >
              {this.props.rangeNames[0]}
            </Button>
            <Button
              disable-auto-styling
              onClick={this.setRange2.bind(this)}
            >
              {this.props.rangeNames[1]}
            </Button>
            <Button
              disable-auto-styling
              onClick={this.setRange3.bind(this)}
            >
              {this.props.rangeNames[2]}
            </Button>
            <Button
              disable-auto-styling
              onClick={this.setRange4.bind(this)}
            >
              {this.props.rangeNames[3]}
            </Button>
          </Segment>
        </ListItem>
        <FlotDiagrammPerZeitraum
          title="NONE"
          FlotUrl={this.props.FlotUrl}
          FlotWidth={this.props.FlotWidth}
          FlotHeight={flotHeight}
          FlotRange={this.state.range}
          FlotTimeFormat={this.state.timeFormat}
          FlotWindowBG={this.props.FlotWindowBG}
          FlotZoom={this.props.FlotZoom}
          FlotHoverDetail={this.props.FlotHoverDetail}
        />
      </List>
    );

    console.log("showInModal");
    console.log(this.props.showInModal);


    if (this.props.showInModal === true) {
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
