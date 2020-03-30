import React from "react";
import { Segment, Button } from "react-onsenui";
import FlotDiagrammPerZeitraum from "./FlotDiagrammPerZeitraum";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class FlotDiagrammPerZeitraumWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: this.props.ranges[this.props.defaultRange],
      timeFormat: this.props.timeFormat[this.props.defaultRange],
      periodName: this.props.rangeNames[this.props.defaultRange]
    };
  }

  setRange1() {
    this.setState({
      range: this.props.ranges[0],
      timeFormat: this.props.timeFormat[0],
      rangeName: this.props.rangeNames[0]
    });
  }
  setRange2() {
    this.setState({
      range: this.props.ranges[1],
      timeFormat: this.props.timeFormat[1],
      rangeName: this.props.rangeNames[1]
    });
  }
  setRange3() {
    this.setState({
      range: this.props.ranges[2],
      timeFormat: this.props.timeFormat[2],
      rangeName: this.props.rangeNames[2]
    });
  }
  setRange4() {
    this.setState({
      range: this.props.ranges[3],
      timeFormat: this.props.timeFormat[3],
      rangeName: this.props.rangeNames[3]
    });
  }

  render() {

    let title = <ons-list-item>
                  <Title
                    title={this.props.title}
                    titleIcon={this.props.titleIcon}
                  />
                </ons-list-item>

    if (this.props.title == "NONE") {
      title = null;
    }

    return (
      <span className={this.props.additionalClass} style={{ minWidth: "50%" }}>
        <ons-col>
          <ons-list>
            <ons-list-header>
              <span className="left titel">{this.props.title}</span>
              <span
                className="right lastupdate"
                style={{ float: "right", paddingRight: "5px" }}
              >
                {moment().format("LLL")}
              </span>
            </ons-list-header>
            {title}
            <ons-list-item>
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
            </ons-list-item>
          </ons-list>
          <FlotDiagrammPerZeitraum
            title="NONE"
            FlotUrl={this.props.FlotUrl}
            FlotWidth={this.props.FlotWidth}
            FlotHeight={this.props.FlotHeight}
            FlotRange={this.state.range}
            FlotTimeFormat={this.state.timeFormat}
            FlotWindowBG={this.props.FlotWindowBG}
            FlotZoom={this.props.FlotZoom}
            FlotHoverDetail={this.props.FlotHoverDetail}
          />
        </ons-col>
      </span>
    );
  }
}
