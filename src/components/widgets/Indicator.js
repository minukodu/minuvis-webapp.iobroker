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

  render() {
    //console.debug("Render Indicator");

    // init
    let val = false;
    let ts = moment();
    if (this.alwaysTrue !== true) {
      // read value and timestamp from props if available
      if (
        this.props.widgetData.states[this.props.widgetData.stateId] &&
        this.props.widgetData.states[this.props.widgetData.stateId].received) {
        val = this.props.widgetData.states[this.props.widgetData.stateId].val;
        ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
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

    let iconColor = this.props.widgetData.colorWhenFalse;
    let bgIconColor = "transparent";
    if (this.stringToBoolean(val, false)) {
      iconColor = this.props.widgetData.colorWhenTrue;
    }

    if (this.props.widgetData.iconFamily === "mfd-icon") {
      bgIconColor = iconColor;
    }

    let timestamp = null;
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span className="right lastupdate" style={{ float: 'right', paddingRight: '5px' }}>{moment(ts).format('DD.MM.YY HH:mm')}</span>
        </ListHeader>
      )
    }

    let displayIcon = "block";
    if (this.props.widgetData.iconFamily === "noIcon") {
      displayIcon = "none";
    }

    return (
      <List id={this.props.widgetData.UUID} className="indicator">
        {timestamp}
        <ListItem>
          <div className="center">
            <div className={"indicatoriconCenter " + this.props.widgetData.iconFamily}>
              <span
                style={{ display: displayIcon, background: bgIconColor, color: iconColor }}
                className={
                  "indicatoricon " +
                  this.props.widgetData.iconFamily +
                  " " +
                  this.props.widgetData.icon +
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
