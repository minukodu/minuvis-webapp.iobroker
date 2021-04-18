import React from "react";
import { Switch, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class MySwitch extends React.Component {
  constructor() {
    super();
    this.state = {
      val: false,
      ts: moment(),
    };
  }

  sendValue(e) {
    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, e.target.checked);
    // State nachführen
    this.setState({
      val: e.target.checked,
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
    let val = false;
    let ts = moment();

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

    return (
      <List id={this.props.widgetData.UUID}>
        {timestamp}
        <ListItem>
          <div className="center">
            <Switch
              disabled={!this.props.widgetData.connected}
              onChange={this.sendValue.bind(this)}
              checked={this.stringToBoolean(val)}
              class={"switchMargin"}
            ></Switch>
          </div>
        </ListItem>
      </List>
    );
  }
}
