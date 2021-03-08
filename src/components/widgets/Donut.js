import React from "react";
import { List, ListItem, ListHeader } from "react-onsenui";
import {
  CircularInput,
  CircularTrack,
  CircularProgress,
  CircularThumb
} from 'react-circular-input'
import RoundSlider from "../utils/RoundSlider";
import moment from "moment";
moment.locale("de-DE");

import { stepperFloat, fixOutputFloat } from "../utils/Utils";

export default class Donut extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: 0,
      ts: moment(),
    };
    this.ts = moment();
    this.val = 0;
    this.decimals = 0;
    this.changing = false;
    this.min = 0;
    this.max = 100;
  }

  circleOnChange(value) {

    // console.log("circleOnChange: " + value);

    let valueToSend = parseFloat(value) * (parseFloat(this.max) - parseFloat(this.min)) + parseFloat(this.min);

    // console.log("circleOnChange toSend: " + valueToSend);

    valueToSend = stepperFloat(valueToSend, this.props.step);

    // console.log("circleOnChange toSend after stepper: " + valueToSend);

    if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(valueToSend);
    }
    // Send only if not updateOnComplete
    if (this.props.updateOnComplete === false) {
      this.props.socket.emit('setState', this.props.stateId, valueToSend);
    }
    //this.props.socket.emit('setState', this.props.stateId, valueToSend);
    //console.debug(this.props.stateId + " :: " + valueToSend);
    // State nachführen
    this.setState({
      val: valueToSend,
      ts: moment(),
    });
    this.val = valueToSend;
    this.changing = true;
  }

  circleOnChangeEnd(value) {

    console.log("circleOnChangeEnd: " + value);

    let valueToSend = parseFloat(value) * (parseFloat(this.max) - parseFloat(this.min)) + parseFloat(this.min);

    valueToSend = valueToSend = stepperFloat(valueToSend.toFixed(this.decimals), this.props.step);

    // console.log("circleOnChangeEnd toSend: " + valueToSend);

    if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(valueToSend);
    }
    // Send only if not updateOnComplete
    // if (this.props.updateOnComplete === false) {
    this.props.socket.emit('setState', this.props.stateId, valueToSend, function (error, message) {
      this.changing = false;
    }.bind(this));
    // }
    //this.props.socket.emit('setState', this.props.stateId, valueToSend);
    //console.debug(this.props.stateId + " :: " + valueToSend);
    // State nachführen
    this.setState({
      val: valueToSend,
      ts: moment(),
    });
    this.val = valueToSend;



  }


  componentWillMount() {
    // console.log("componentWillMount Donut");
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
    // console.log("render Donut");
    // console.log(this.props.states[this.props.stateId]);
    // console.log(this.changing);
    // console.log("this.val: " + this.val);
    // console.log("this.ts: " + this.ts);
    // console.log("this.changing: " + this.changing);
    // read value and timestamp from props if available
    if (
      this.props.states[this.props.stateId] &&
      typeof this.props.states[this.props.stateId] !== "undefined" &&
      this.changing === false
      // this.props.states[this.props.stateId].ts &&
      // this.props.states[this.props.stateId].ts !== this.ts
    ) {
      this.val = this.props.states[this.props.stateId].val || 0;
      this.ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      this.val = this.val || 0;
      this.ts = this.state.ts;
    }

    // console.log("Donut value:");
    // console.log("this.val: " + this.val);
    // console.log("this.ts: " + this.ts);

    let timestamp = null;
    if (this.props.timestamp && this.props.timestamp === true) {
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

    this.min = this.props.min;
    this.max = this.props.max;


    // check min and max
    if (this.min >= this.max) {
      console.log("donut :: min >= max : " + this.min + "<=" + this.max);
      this.max = this.min + 10;
    }

    // limit min / max
    if (this.val < this.min) { this.val = this.min; };
    if (this.val > this.max) { this.val = this.max; };




    // circular
    const rangeValue = (parseFloat(this.val) - parseFloat(this.min)) / (parseFloat(this.max) - parseFloat(this.min));
    console.log("rangeValue: " + rangeValue);

    // this.decimals = countDecimals(this.props.step);
    // console.log("this.decimals: " + this.decimals);

    // decimals
    this.decimals = this.props.decimals;
    if (this.decimals < 0) { this.decimals = 0 };
    if (this.decimals > 5) { this.decimals = 5 };


    // set default
    let onChangeFunction = (value) => this.circleOnChange(value);
    let onChangeEndFunction = (value) => this.circleOnChangeEnd(value);
    let progessStrokeWidth = 3;
    let progessStroke = "var(--highlight-color)";
    let thumb = (
      <CircularThumb
        key={"cth_" + this.props.UUID}
        r={6}
        strokeWidth={2}
        fill={"var(--highlight-color)"}
        stroke={"var(--highlight-color)"}
      />
    );
    // calculate size:
    let inputRadius = this.props.widgetHeight / 3 * 75; // 3 grids high = 70px radius
    let textFontsize = this.props.widgetHeight / 3 * 20; // 3 grids high = 20px fontSize


    // handle readOnly    
    if (this.props.readOnly === true) {
      onChangeFunction = null;
      onChangeEndFunction = null;
      progessStrokeWidth = 10;
      thumb = null;
      progessStroke = this.props.color;
      if (this.val <= this.props.minValue) {
        progessStroke = this.props.minColor;
      }
      if (this.val >= this.props.maxValue) {
        progessStroke = this.props.maxColor;
      }
    }

    let height = this.props.widgetHeight * 60;
    let width = height;

    return (
      <List id={this.props.UUID} class={"donutWidget"} >
        {timestamp}

        <ListItem>
          <div
            id={"rs-" + this.props.UUID}
            style={{
              width: width + "px",
              height: height + "px",
              margin: "auto",
            }}>
            <RoundSlider
              parentId={"rs-" + this.props.UUID}
              settings={this.props}
            />
          </div>
        </ListItem>

        {/* <ListItem>
          <div style={{ margin: "auto" }}>
            <CircularInput
              key={"ci_" + this.props.UUID}
              value={rangeValue}
              radius={inputRadius}
              onChange={onChangeFunction}
              onChangeEnd={onChangeEndFunction}>
              <CircularTrack
                key={"ct_" + this.props.UUID}
                strokeWidth={2}
                stroke="var(--material-switch-active-background-color)" />
              <CircularProgress
                key={"cp_" + this.props.UUID}
                strokeWidth={progessStrokeWidth}
                stroke={progessStroke}
              />
              {thumb}
              <text x={inputRadius} y={inputRadius} fontSize={textFontsize + "px"} fill="var(--text-color)" textAnchor="middle" dy="0.3em">
                {fixOutputFloat(this.val, this.decimals) + this.props.unit}
              </text>
            </CircularInput>
          </div>
        </ListItem> */}
      </List>
    );
  }
}
