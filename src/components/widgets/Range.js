import React from "react";
import { Col, List, ListItem, ListHeader } from "react-onsenui";
import InputRange from 'react-input-range';
import moment from "moment";
moment.locale("de-DE");

import { fixOutputFloat } from "../utils/Utils";

export default class MyRange extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0,
      ts: moment(),
    };
    this.ts = moment();
    this.val = 0;
    this.changing = false;
    this.decimals = 0;
  }

  stringToBoolean(val) {
    if (val === null) {
      return false;
    }
    if (typeof val === "number") {
      return Boolean(val);
    }
    if (typeof val !== "string") {
      return val;
    }
    switch (val.toLowerCase().trim()) {
      case "on":
      case "true":
      case "yes":
      case "1":
        return true;
      case "off":
      case "false":
      case "no":
      case "0":
      case null:
        return false;
      default:
        return Boolean(val);
    }
  }

  RangeOnChange(value) {
    let valueToSend = value;
    if (this.props.widgetData.stateIdType === "number") {
      valueToSend = parseFloat(value);
    }
    // Send only if not updateOnComplete
    if (this.props.widgetData.updateOnComplete === false) {
      this.props.widgetData.socket.emit('setState', this.props.widgetData.stateId, valueToSend);
    }
    //this.props.widgetData.socket.emit('setState', this.props.widgetData.stateId, valueToSend);
    console.debug(this.props.widgetData.stateId + " :: " + value);
    // State nachführen
    this.setState({
      val: value,
      ts: moment(),
    });
    this.val = value;
  }

  RangeOnChangeComplete(value) {
    let valueToSend = value;
    if (this.props.widgetData.stateIdType === "number") {
      valueToSend = parseFloat(value);
    }

    this.props.widgetData.socket.emit('setState', this.props.widgetData.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: value,
      ts: moment(),
    });
    this.val = value;
    this.changing = false;
    // console.debug("RangeOnChangeComplete");
    // console.debug(this.props.widgetData.stateId + " :: " + value);
  }

  RangeOnChangeStart() {
    // State nachführen
    // this.setState({
    //   changing : true
    // });
    this.changing = true;

  }

  sendValue(e) {
    let valueToSend = e.target.value;
    if (this.props.widgetData.stateIdType === "number") {
      valueToSend = parseFloat(e.target.value);
    }

    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
  }

  render() {
    // console.log("render myRange");
    // console.log("this.val: " + this.val);
    // console.log("this.ts: " + this.ts);
    // console.log("this.changing: " + this.changing);
    // read value and timestamp from props if available
    if (
      this.props.widgetData.states[this.props.widgetData.stateId] &&
      this.props.widgetData.states[this.props.widgetData.stateId].received === true &&
      this.changing === false
    ) {
      this.val = this.props.widgetData.states[this.props.widgetData.stateId].val || 0;
      this.ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    } else {
      // read from this.state
      this.val = this.val || 0;
      this.ts = this.state.ts;
    }

    // console.log("this.val: " + this.val);
    // console.log("this.ts: " + this.ts);

    // decimals
    this.decimals = this.props.widgetData.decimals;
    if (this.decimals < 0) { this.decimals = 0 };
    if (this.decimals > 5) { this.decimals = 5 };

    let maxIcon = this.props.widgetData.maxIcon || "text_max";
    let minIcon = this.props.widgetData.minIcon || "text_min";

    let displayIconMax = "block";
    if (this.props.widgetData.maxIconFamily === "noIcon") {
      displayIconMax = "none";
    }
    let displayIconMin = "block";
    if (this.props.widgetData.minIconFamily === "noIcon") {
      displayIconMin = "none";
    }

    let timestamp = null;
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{ float: "right", paddingRight: "5px" }}
          >
            {moment(this.ts).format("DD.MM.YY HH.mm")}
          </span>
        </ListHeader>
      );
    }

    // disbaled from connected or disabled-state
    let disabled = !this.props.widgetData.connected;
    if (
      this.props.widgetData.states[this.props.widgetData.stateIdDisabled] &&
      this.props.widgetData.states[this.props.widgetData.stateIdDisabled].received === true
    ) {
      disabled = disabled || this.stringToBoolean(this.props.widgetData.states[this.props.widgetData.stateIdDisabled].val);
    }
    // display from invisible-state
    let display = true;
    if (
      this.props.widgetData.states[this.props.widgetData.stateIdInvisible] &&
      this.props.widgetData.states[this.props.widgetData.stateIdInvisible].received === true
    ) {
      display = !this.stringToBoolean(this.props.widgetData.states[this.props.widgetData.stateIdInvisible].val);
    }


    return (
      <List 
        id={this.props.widgetData.UUID} 
        class={"sliderWidget"}
        style={{ display: display?"block":"none" }} >
        {timestamp}
        <ListItem style={{ padding: 0 }}>
          <div style={{ display: "flex", width: "100%", flexDirection: "row", flexWrap: "nowrap" }}>
            <Col
              class={"sliderIconMin"}
              style={{ display: displayIconMin, flexBasis: "50px", minWidth: "50px" }}
            >
              <span
                className={
                  "sliderIcon min  " +
                  this.props.widgetData.minIconFamily +
                  " " + minIcon
                }
              ></span>
            </Col>
            <Col style={{ borderLeft: "none", flexBasis: "auto", flexGrow: 1, alignSelf: "center" }}>
              <InputRange
                formatLabel={value => `${fixOutputFloat(this.val, this.decimals)} ${this.props.widgetData.unit}`}
                disabled={disabled}
                maxValue={this.props.widgetData.max}
                minValue={this.props.widgetData.min}
                step={this.props.widgetData.step}
                value={parseFloat(this.val)}
                onChange={this.RangeOnChange.bind(this)}
                onChangeComplete={this.RangeOnChangeComplete.bind(this)}
                onChangeStart={this.RangeOnChangeStart.bind(this)}
                style={{ width: 100 + "%", minHeight: "50px" }}
              />
            </Col>
            <Col
              class={"sliderIconMax"}
              style={{ display: displayIconMax, flexBasis: "50px", minWidth: "50px" }}
            >
              <span
                className={
                  "sliderIcon max " +
                  this.props.widgetData.maxIconFamily +
                  " " + maxIcon
                }
              ></span>
            </Col>
          </div>
        </ListItem>
      </List>
    );
  }
}
