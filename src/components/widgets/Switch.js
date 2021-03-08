import React from "react";
import { Switch, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class MySwitch extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: false,
      ts: moment(),
    };
  }

  sendValue(e) {
    this.props.socket.emit("setState", this.props.stateId, e.target.checked);
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

  componentWillMount() {
    // console.log("componentWillMount Switch");

    if (typeof this.props.states[this.props.stateId] === "undefined") {
      if (this._stateId_subscribed === false) {
        // Subscribe state
        // console.log("Subscribe " + this.props.stateId);
        this.props.socket.emit("subscribe", this.props.stateId);
        this._stateId_subscribed = true;
        // Read state
        this.props.socket.emit(
          "getStates",
          [this.props.stateId],
          function (err, states) {
            // console.log("Received States");
            // console.dir(states);
            // eintragen
            this.setState({
              val: states[this.props.stateId].val,
              ts: states[this.props.stateId].ts,
            });
          }.bind(this)
        );
      }
    } else {
      // console.log("Read " + this.props.stateId);
      this.setState({
        val: this.props.states[this.props.stateId].val,
        ts: this.props.states[this.props.stateId].ts,
      });
    }
  }

  render() {
    // init
    let val = false;
    let ts = moment();

    if (typeof this.props.states[this.props.stateId] !== "undefined") {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    let timestamp = null;
    if (this.props.timestamp && this.props.timestamp === true) {
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
        <List id={this.props.UUID}>
          {timestamp}
          <ListItem>
            <div className="center">
              <Switch
                disabled={!this.props.connected}
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
