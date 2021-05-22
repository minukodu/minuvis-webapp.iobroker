import React from 'react';
import { List, ListItem, ListHeader } from "react-onsenui";
import numeral from "numeral";
import moment from 'moment';
moment.locale('de-DE');

export default class Output extends React.Component {

  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "---",
      ts: moment()
    };
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  render() {

    // console.debug("Render Output");

    // init
    let val = "---";
    let ts = moment();
    // read value and timestamp from props if available
    if (this.props.widgetData.states[this.props.widgetData.stateId] && this.props.widgetData.states[this.props.widgetData.stateId].received === true) {
      val = this.props.widgetData.states[this.props.widgetData.stateId].val;
      ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }
    let fontColor = this.props.widgetData.color;
    let formatedValue = val;

    // check if value is numeric
    if (this.isNumeric(val)) {
      // Format Value
      // console.log("Output-Format: " + this.props.widgetData.format)
      formatedValue = numeral(val).format(this.props.widgetData.format);

      // calculate Color

      if (val <= this.props.widgetData.minValue) {
        fontColor = this.props.widgetData.minColor;
      }
      if (val >= this.props.widgetData.maxValue) {
        fontColor = this.props.widgetData.maxColor;
      }
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

    let fontSize = "100%";

    return (
      <List id={this.props.widgetData.UUID} className="output" style={{ transform: "scale(" + (this.props.widgetData.zoom || 100) / 100 + ")" }}>
        {timestamp}
        <ListItem>
          <div className="center" style={{ fontSize }}>
            <div className="centerWidget">
              <output style={{ color: fontColor }} data-iobroker={this.props.widgetData.stateId}>{formatedValue}</output>&nbsp;{this.props.widgetData.unit}
            </div>
          </div>
        </ListItem>
      </List>
    );
  }

}

