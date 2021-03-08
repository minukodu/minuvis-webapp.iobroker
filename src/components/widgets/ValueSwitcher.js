import React from "react";
import { Button, List, ListItem, ListHeader } from "react-onsenui";
import Indicator from "./Indicator";
import moment from "moment";
moment.locale("de-DE");

export default class ValueSwitcher extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: 0,
      ts: moment(),
    };
  }

  sendValueElement(e) {

    let valueToSend = e.target.value;
    if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(e.target.value);
    }
    else if (this.props.stateIdType === "boolean") {
      valueToSend = this.stringToBoolean(e.target.value);
    }

    this.props.socket.emit("setState", this.props.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
  }

  sendValue(value) {
    if (this.props.readOnly === true) {
      return;
    }

    let valueToSend = value;
    if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(value);
    }
    else if (this.props.stateIdType === "boolean") {
      valueToSend = this.stringToBoolean(value);
    }

    this.props.socket.emit("setState", this.props.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: value,
      ts: moment(),
    });
  }
  sendValue1() {
    this.sendValue(this.props.value1);
  }
  sendValue2() {
    this.sendValue(this.props.value2);
  }
  sendValue3() {
    this.sendValue(this.props.value3);
  }
  sendValue4() {
    this.sendValue(this.props.value4);
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

    console.log("Render ValueSwitcher");
    console.log("Buttons: " + this.props.nbOfButtons);


    // init
    let val = 0;
    let ts = moment();
    let highlightBtnNr = 0;
    // read value and timestamp from props if available
    if (
      typeof this.props.states[this.props.stateId] !== "undefined" &&
      this.props.states[this.props.stateId]
    ) {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    let displayBtn1 = "block";
    let displayBtn2 = "block";
    let displayBtn3 = "block";
    let displayBtn4 = "block";
    let allBtnWidth = 92;
    let btnWidth = allBtnWidth / 4;
    let btnMarginRight = "2%";

    if (this.props.nbOfButtons < 2) {
      displayBtn2 = "none";
      displayBtn3 = "none";
      displayBtn4 = "none";
      btnWidth = 98;
      btnMarginRight = "0";
    } else if (this.props.nbOfButtons < 3) {
      displayBtn3 = "none";
      displayBtn4 = "none";
      btnWidth = 96 / 2;
    } else if (this.props.nbOfButtons < 4) {
      displayBtn4 = "none";
      btnWidth = 94 / 3;
    }

    console.log("Render ValueSwitcher");

    let valueString = "--";
    if (this.props.stateIdType === "boolean" && val === true) {
      valueString = "true";
    }
    if (this.props.stateIdType === "boolean" && val === false) {
      valueString = "false";
    }
    if (this.props.stateIdType !== "boolean" && val) {
      valueString = val.toString();
    }

    let valueText = (
      <div className="right noLowLightIfDisabled">
        <output
          disable-auto-styling={"disable-auto-styling"}
          value={valueString}
        >
          {valueString +
            (this.props.unit.length > 0 ? " " : "") +
            this.props.unit}
        </output>
      </div>
    );

    if (this.props.hideValue === true) {
      valueText = null;
    }

    let timestamp = null;
    if (this.props.timestamp && this.props.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{ float: "right", paddingRight: "5px" }}
          >
            {moment(ts).format("DD.MM.YY HH.mm")}
          </span>
        </ListHeader>
      )
    }

    this.hideTextClass = "";
    if (this.props.hideText && this.props.hideText === true) {
      this.hideTextClass = "hidden";
    }
    console.log("############ hideText");
    console.log(this.props.hideText);
    console.log(this.hideTextClass);

    // console.log("############ ValueSwitcher values");
    // console.log(this.props.stateIdType);
    // console.log(this.props.hightlightExactValueOnly);
    // console.log(val);
    // console.log(this.props.value1);
    // console.log(this.props.value2);
    // console.log(this.props.value3);
    // console.log(this.props.value4);


    // highlight Buttons
    if (this.props.stateIdType !== "number" || this.props.hightlightExactValueOnly === true) {
      if (val == this.props.value1) { highlightBtnNr = 1 };
      if (val == this.props.value2) { highlightBtnNr = 2 };
      if (val == this.props.value3) { highlightBtnNr = 3 };
      if (val == this.props.value4) { highlightBtnNr = 4 };
    } else if (this.props.stateIdType === "number") {
      if (val <= this.props.value1) { highlightBtnNr = 1 };
      if (val > this.props.value1 && val <= this.props.value2) { highlightBtnNr = 2 };
      if (val > this.props.value2 && val <= this.props.value3) { highlightBtnNr = 3 };
      if (val > this.props.value3) { highlightBtnNr = 4 };
    }


    // make icons for indicator
    let indicatorIcon = this.props.icon1;
    let indicatorIconFamily = this.props.iconFamily1;
    let indicatorColor = this.props.indicatorColor1;

    if (highlightBtnNr === 2) {
      indicatorIcon = this.props.icon2;
      indicatorIconFamily = this.props.iconFamily2;
      indicatorColor = this.props.indicatorColor2;
    } else if (highlightBtnNr === 3) {
      indicatorIcon = this.props.icon3;
      indicatorIconFamily = this.props.iconFamily3;
      indicatorColor = this.props.indicatorColor3;
    } else if (highlightBtnNr === 4) {
      indicatorIcon = this.props.icon4;
      indicatorIconFamily = this.props.iconFamily4;
      indicatorColor = this.props.indicatorColor4;
    }

    let compactModeClass = "";

    let valueswitcher = (
      <List id={this.props.UUID} class={compactModeClass}>
        {timestamp}
        <ListItem class="valueSwitcherBtnList">
          <Button
            disable-auto-styling={"disable-auto-styling"}
            modifier={highlightBtnNr === 1 ? "" : "outline"}
            onClick={this.sendValue1.bind(this)}
            disabled={this.props.readOnly}
            style={{
              display: displayBtn1,
              width: btnWidth + "%",
              marginRight: btnMarginRight,
            }}
          >
            <span
              className={"valueSwitcherIcon min " + this.props.iconFamily1 + " " + this.props.icon1 + " " + compactModeClass}
            ></span>
            <span className={"valueSwitcherValue " + this.hideTextClass}>
              {this.props.value1.toString() +
                (this.props.unit.length > 0 ? " " : "") +
                this.props.unit}
            </span>
          </Button>
          <Button
            disable-auto-styling={"disable-auto-styling"}
            modifier={highlightBtnNr === 2 ? "" : "outline"}
            onClick={this.sendValue2.bind(this)}
            disabled={this.props.readOnly}
            style={{
              display: displayBtn2,
              width: btnWidth + "%",
              marginRight: btnMarginRight,
            }}
          >
            <span
              className={"valueSwitcherIcon min " + this.props.iconFamily2 + " " + this.props.icon2 + " " + compactModeClass}
            ></span>
            <span className={"valueSwitcherValue " + this.hideTextClass}>
              {this.props.value2.toString() +
                (this.props.unit.length > 0 ? " " : "") +
                this.props.unit}
            </span>
          </Button>
          <Button
            disable-auto-styling={"disable-auto-styling"}
            modifier={highlightBtnNr === 3 ? "" : "outline"}
            onClick={this.sendValue3.bind(this)}
            disabled={this.props.readOnly}
            style={{
              display: displayBtn3,
              width: btnWidth + "%",
              marginRight: btnMarginRight,
            }}
          >
            <span
              className={"valueSwitcherIcon min " + this.props.iconFamily3 + " " + this.props.icon3 + " " + compactModeClass}
            ></span>
            <span className={"valueSwitcherValue " + this.hideTextClass}>
              {this.props.value3.toString() +
                (this.props.unit.length > 0 ? " " : "") +
                this.props.unit}
            </span>
          </Button>
          <Button
            disable-auto-styling={"disable-auto-styling"}
            modifier={highlightBtnNr === 4 ? "" : "outline"}
            onClick={this.sendValue4.bind(this)}
            disabled={this.props.readOnly}
            style={{
              display: displayBtn4,
              width: btnWidth + "%",
              marginRight: btnMarginRight,
            }}
          >
            <span
              className={"valueSwitcherIcon min " + this.props.iconFamily4 + " " + this.props.icon4 + " " + compactModeClass}
            ></span>
            <span className={"valueSwitcherValue " + this.hideTextClass}>
              {this.props.value4.toString() +
                (this.props.unit.length > 0 ? " " : "") +
                this.props.unit}
            </span>
          </Button>
        </ListItem>
      </List >
    );

    let indicator = (
      <Indicator
        key={this.props.UUID}
        UUID={this.props.UUID}
        connected={this.props.connected}
        socket={this.props.socket}
        states={this.props.states}
        title={this.props.title}
        stateId={"undefined"}
        stateIdType={"undefined"}
        titleIcon={this.props.titleIcon}
        titleIconFamily={this.props.titleIconFamily}
        icon={indicatorIcon}
        iconFamily={indicatorIconFamily}
        colorWhenTrue={indicatorColor}
        colorWhenFalse={"#222222"}
        alwaysTrue={true}
        compactMode={this.props.compactMode}
        timestamp={this.props.timestamp}
      />
    );

    if (this.props.showAsIndicator && this.props.showAsIndicator === true) {
      return indicator;
    } else {
      return valueswitcher;
    }
  }
}
