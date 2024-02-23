import React from "react";
import { Select, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class Dropdown extends React.Component {
  constructor() {
    super();
    this.state = {
      val: false,
      ts: moment(),
    };
  }

  sendValue(e) {

    let value = e.target.value;
    if (this.props.widgetData.stateIdType === "boolean") {
      value = this.stringToBoolean(value);
    }
    if (this.props.widgetData.stateIdType === "number") {
      value = parseInt(value, 10);
    }

    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, value);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
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

  render() {
    // init
    let val = "";
    let ts = moment();

    // disbaled from connected or disabled-state
    let disabled = !this.props.widgetData.connected;
    if (
      this.props.widgetData.stateIdDisabled &&
      this.props.widgetData.stateIdDisabled != "undefined" &&
      this.props.widgetData.states[this.props.widgetData.stateIdDisabled] &&
      this.props.widgetData.states[this.props.widgetData.stateIdDisabled].received === true
    ) {
      disabled = disabled || this.stringToBoolean(this.props.widgetData.states[this.props.widgetData.stateIdDisabled].val);
    }
    // display from invisible-state
    let display = true;
    if (
      this.props.widgetData.stateIdInvisible &&
      this.props.widgetData.stateIdInvisible != "undefined" &&
      this.props.widgetData.states[this.props.widgetData.stateIdInvisible] &&
      this.props.widgetData.states[this.props.widgetData.stateIdInvisible].received === true
    ) {
      display = !this.stringToBoolean(this.props.widgetData.states[this.props.widgetData.stateIdInvisible].val);
    }

    if (
      this.props.widgetData.states[this.props.widgetData.stateId] &&
      this.props.widgetData.states[this.props.widgetData.stateId].received === true
    ) {
      val = this.props.widgetData.states[this.props.widgetData.stateId].val;
      ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    if (val === null || val === undefined) { val = "" };
    ts = ts || moment();

    let timestamp = null;
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{ float: "right", paddingRight: "5px" }}
          >
            {moment(ts).format("DD.MM.YY HH:mm")}
          </span>
        </ListHeader>
      );
    }

    // generate options
    let dropDownOptions = [];
    let dropDownValues = this.props.widgetData.values.split(",");
    let dropDownDescriptions = this.props.widgetData.descriptions.split(",");
    for (let v in dropDownValues) {
      let description = dropDownDescriptions[v] || dropDownValues[v];
      dropDownOptions.push(
        <option key={"ddo-" + v} value={dropDownValues[v]}>{description}</option>
      )
    }

    console.log("val.toString()");
    console.log(val.toString());

    return (
      <List id={this.props.widgetData.UUID} className="dropDown" style={{ display: display ? "block" : "none" }} >
        {timestamp}
        <ListItem>
          <div className="center">
            <Select
              value={val.toString()}
              disabled={disabled}
              onChange={this.sendValue.bind(this)}
            >
              {dropDownOptions}
            </Select>
          </div>
        </ListItem>
      </List>
    );
  }
}
