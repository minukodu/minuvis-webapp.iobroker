import React from "react";
import { Switch } from "react-onsenui";
import Title from "./Title";
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
    // console.dir(this.props.states);
    // console.log(typeof this.props.states[this.props.stateId]);

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

    // console.log("Switch connected:");
    // console.log(this.props);
    // console.log(this.props.connected);
    // console.log(!this.props.connected);
  }

  render() {
    // init
    let val = false;
    let ts = moment();
    // read value and timestamp from props if available
    // console.log("render switch");
    // console.log(this.props.stateId);
    // console.log(this.props.states);
    // console.log(this.props.states[this.props.stateId]);
    // console.log(typeof this.props.states[this.props.stateId]);
    // console.log("this.props.titleIconFamily");
    // console.log(this.props.titleIconFamily);
    

    if (typeof this.props.states[this.props.stateId] !== "undefined") {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    let header = (
      <ons-list-header>
        <span
          className="right lastupdate"
          style={{ float: "right", paddingRight: "5px" }}
        >
          {moment(ts).format("LLL")}
        </span>
      </ons-list-header>
    );

    let compactModeClass = "";

    if (this.props.compactMode === true) {
      header = null;
      compactModeClass = "compactMode";
    }

    return (
      <ons-col id={this.props.UUID}>
        <ons-list>
          {header}
          <ons-list-item>
            <Title
              title={this.props.title}
              titleIcon={this.props.titleIcon}
              titleIconFamily={this.props.titleIconFamily}
              compactMode={this.props.compactMode}
            />
            <div className="right">
              <Switch
                disable-auto-styling
                disabled={!this.props.connected}
                onChange={this.sendValue.bind(this)}
                checked={this.stringToBoolean(val)}
                class={compactModeClass}
              ></Switch>
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
