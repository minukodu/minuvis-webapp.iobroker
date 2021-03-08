import React from "react";
import { Col, List, ListItem, ListHeader } from "react-onsenui";
import InputRange from 'react-input-range';
import moment from "moment";
moment.locale("de-DE");

import { fixOutputFloat } from "../utils/Utils";

export default class MyRange extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: 0,
      ts: moment(),
    };
    this.ts = moment();
    this.val = 0;
    this.changing = false;
    this.decimals = 0;
  }

  RangeOnChange(value) {
    let valueToSend = value;
    if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(value);
    }
    // Send only if not updateOnComplete
    if (this.props.updateOnComplete === false) {
      this.props.socket.emit('setState', this.props.stateId, valueToSend);
    }
    //this.props.socket.emit('setState', this.props.stateId, valueToSend);
    console.debug(this.props.stateId + " :: " + value);
    // State nachführen
    this.setState({
      val: value,
      ts: moment(),
    });
    this.val = value;
  }

  RangeOnChangeComplete(value) {
    let valueToSend = value;
    if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(value);
    }

    this.props.socket.emit('setState', this.props.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: value,
      ts: moment(),
    });
    this.val = value;
    this.changing = false;
    // console.debug("RangeOnChangeComplete");
    // console.debug(this.props.stateId + " :: " + value);
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
    if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(e.target.value);
    }

    this.props.socket.emit("setState", this.props.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
  }

  componentWillMount() {
    // console.log("componentWillMount myRange");
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
    // console.log("render myRange");
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

    // console.log("this.val: " + this.val);
    // console.log("this.ts: " + this.ts);

    // decimals
    this.decimals = this.props.decimals;
    if (this.decimals < 0) { this.decimals = 0 };
    if (this.decimals > 5) { this.decimals = 5 };

    let maxIcon = this.props.maxIcon || "text_max";
    let minIcon = this.props.minIcon || "text_min";

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

    return (
      <List id={this.props.UUID} class={"sliderWidget"} >
        {timestamp}
        <ListItem style={{ padding: 0 }}>
          <div style={{ display: "flex", width: "100%", flexDirection: "row", flexWrap: "nowrap" }}>
            <Col
              class={"sliderIconMin"}
              style={{ flexBasis: "50px", minWidth: "50px" }}
            >
              <span
                className={
                  "sliderIcon min  " +
                  this.props.minIconFamily +
                  " " + minIcon
                }
              ></span>
            </Col>
            <Col style={{ minWidthhh: 80 + "%", borderLeft: "none", flexBasis: "auto", flexGrow: 1, alignSelf: "center" }}>
              <InputRange
                formatLabel={value => `${fixOutputFloat(this.val, this.decimals)} ${this.props.unit}`}
                disabled={!this.props.connected}
                maxValue={this.props.max}
                minValue={this.props.min}
                step={this.props.step}
                value={parseFloat(this.val)}
                onChange={this.RangeOnChange.bind(this)}
                onChangeComplete={this.RangeOnChangeComplete.bind(this)}
                onChangeStart={this.RangeOnChangeStart.bind(this)}
                style={{ width: 100 + "%" }}
              />
            </Col>
            <Col
              class={"sliderIconMax"}
              style={{ flexBasis: "50px", minWidth: "50px" }}
            >
              <span
                className={
                  "sliderIcon max " +
                  this.props.maxIconFamily +
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
