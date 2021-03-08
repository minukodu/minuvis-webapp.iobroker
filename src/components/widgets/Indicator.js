import React from "react";
import { List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class Indicator extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.alwaysTrue = false;
    this.state = {
      val: false,
      ts: moment()
    };
  }

  stringToBoolean(val, neg) {
    if (val === null) {
      return false;
    }
    if (neg === true) {
      if (typeof val === "boolean") {
        return !val;
      }
      if (typeof val === "number") {
        return !Boolean(val);
      }
      if (typeof val !== "string") {
        return val;
      }
      switch (val.toLowerCase().trim()) {
        case "on":
        case "true":
        case "yes":
        case "1":
          return false;
        case "off":
        case "false":
        case "no":
        case "0":
        case null:
          return true;
        default:
          return !Boolean(val);
      }
    } else {
      if (typeof val === "boolean") {
        return val;
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
  }

  componentWillMount() {
    // console.dir(this.props.states);
    // console.log(typeof this.props.states[this.props.stateId]);

    // special case "always true" for value-switcher usecase
    console.log("alway true: " + this.props.alwaysTrue)
    if (this.props.alwaysTrue && this.props.alwaysTrue === true) {
      this.alwaysTrue = true;
    }
    //console.log("always true prop: " + this.props.alwaysTrue)
    //console.log("always true this: " + this.alwaysTrue)

    if (typeof this.props.states[this.props.stateId] === "undefined" && this.alwaysTrue !== true) {
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
              ts: states[this.props.stateId].ts
            });
          }.bind(this)
        );
      }
    } else {
      if (this.alwaysTrue !== true) {
        // console.log("Read " + this.props.stateId);
        this.setState({
          val: this.props.states[this.props.stateId].val,
          ts: this.props.states[this.props.stateId].ts
        });
      }
    }

    // console.log("Switch connected:");
    // console.log(this.props);
    // console.log(this.props.connected);
    // console.log(!this.props.connected);
  }

  render() {
    //console.debug("Render Indicator");

    // init
    let val = false;
    let ts = moment();
    if (this.alwaysTrue !== true) {
      // read value and timestamp from props if available
      if (typeof this.props.states[this.props.stateId] !== "undefined") {
        val = this.props.states[this.props.stateId].val;
        ts = this.props.states[this.props.stateId].ts;
      } else {
        // read from this.state
        val = this.state.val;
        ts = this.state.ts;
      }
    } else {
      // always true
      val = true;
      ts = moment();
    }

    let strValue = this.stringToBoolean(val, false).toString();

    let iconColor = this.props.colorWhenFalse;
    let bgIconColor = "transparent";
    if (this.stringToBoolean(val, false)) {
      iconColor = this.props.colorWhenTrue;
    }

    if (this.props.iconFamily === "mfd-icon") {
      bgIconColor = iconColor;
    }

    let timestamp = null;
    if (this.props.timestamp && this.props.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span className="right lastupdate" style={{ float: 'right', paddingRight: '5px' }}>{moment(ts).format('DD.MM.YY HH:mm')}</span>
        </ListHeader>
      )
    }

    let fontSize = "100%";
    let compactModeClass = "";

    if (this.props.compactMode === true) {
      timestamp = null;
      fontSize = "80%";
      compactModeClass = "compactMode";
    }

    return (
      <List id={this.props.UUID}>
        {timestamp}
        <ListItem>
          <div className="center">
            <div className={"indicatoriconCenter " + this.props.iconFamily}>
              <span
                style={{ background: bgIconColor, color: iconColor }}
                className={
                  "indicatoricon " +
                  this.props.iconFamily +
                  " " +
                  this.props.icon +
                  " " +
                  strValue
                }
              ></span>
            </div>
          </div>
        </ListItem>
      </List>
    );
  }
}
