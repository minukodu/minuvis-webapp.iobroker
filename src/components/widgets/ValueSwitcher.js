import React from "react";
import { Button, List, ListItem, ListHeader } from "react-onsenui";
import Indicator from "./Indicator";
import moment from "moment";
moment.locale("de-DE");

export default class ValueSwitcher extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0,
      ts: moment(),
    };
  }

  sendValueElement(e) {

    let valueToSend = e.target.value;
    if (this.props.widgetData.stateIdType === "number") {
      valueToSend = parseFloat(e.target.value);
    }
    else if (this.props.widgetData.stateIdType === "boolean") {
      valueToSend = this.stringToBoolean(e.target.value);
    }

    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
  }

  sendValue(value) {
    if (this.props.widgetData.readOnly === true) {
      return;
    }

    let valueToSend = value;
    if (this.props.widgetData.stateIdType === "number") {
      valueToSend = parseFloat(value);
    }
    else if (this.props.widgetData.stateIdType === "boolean") {
      valueToSend = this.stringToBoolean(value);
    }

    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: value,
      ts: moment(),
    });
  }
  sendValue1() {
    this.sendValue(this.props.widgetData.value1);
  }
  sendValue2() {
    this.sendValue(this.props.widgetData.value2);
  }
  sendValue3() {
    this.sendValue(this.props.widgetData.value3);
  }
  sendValue4() {
    this.sendValue(this.props.widgetData.value4);
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

    // console.log("Render ValueSwitcher");
    // console.log("Buttons: " + this.props.widgetData.nbOfButtons);


    // init
    let val = 0;
    let ts = moment();
    let highlightBtnNr = 0;
    // read value and timestamp from props if available
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

    let displayBtn1 = "block";
    let displayBtn2 = "block";
    let displayBtn3 = "block";
    let displayBtn4 = "block";

    if (this.props.widgetData.iconFamily1 === "noIcon") {
      displayBtn1 = "flex";
    }
    if (this.props.widgetData.iconFamily2 === "noIcon") {
      displayBtn2 = "flex";
    }
    if (this.props.widgetData.iconFamily3 === "noIcon") {
      displayBtn3 = "flex";
    }
    if (this.props.widgetData.iconFamily4 === "noIcon") {
      displayBtn4 = "flex";
    }

    let allBtnWidth = 92;
    let btnWidth = allBtnWidth / 4;
    let btnMarginRight = "2%";

    if (this.props.widgetData.nbOfButtons < 2) {
      displayBtn2 = "none";
      displayBtn3 = "none";
      displayBtn4 = "none";
      btnWidth = 98;
      btnMarginRight = "0";
    } else if (this.props.widgetData.nbOfButtons < 3) {
      displayBtn3 = "none";
      displayBtn4 = "none";
      btnWidth = 96 / 2;
    } else if (this.props.widgetData.nbOfButtons < 4) {
      displayBtn4 = "none";
      btnWidth = 94 / 3;
    }

    console.log("Render ValueSwitcher");

    let valueString = "--";
    if (this.props.widgetData.stateIdType === "boolean" && val === true) {
      valueString = "true";
    }
    if (this.props.widgetData.stateIdType === "boolean" && val === false) {
      valueString = "false";
    }
    if (this.props.widgetData.stateIdType !== "boolean" && val) {
      valueString = val.toString();
    }

    let valueText = (
      <div className="right noLowLightIfDisabled">
        <output
          disable-auto-styling={"disable-auto-styling"}
          value={valueString}
        >
          {valueString +
            (this.props.widgetData.unit.length > 0 ? " " : "") +
            this.props.widgetData.unit}
        </output>
      </div>
    );

    if (this.props.widgetData.hideValue === true) {
      valueText = null;
    }

    let timestamp = null;
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
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
    if (this.props.widgetData.hideText && this.props.widgetData.hideText === true) {
      this.hideTextClass = "hidden";
    }
    console.log("############ hideText");
    console.log(this.props.widgetData.hideText);
    console.log(this.hideTextClass);

    // console.log("############ ValueSwitcher values");
    // console.log(this.props.widgetData.stateIdType);
    // console.log(this.props.widgetData.hightlightExactValueOnly);
    // console.log(val);
    // console.log(this.props.widgetData.value1);
    // console.log(this.props.widgetData.value2);
    // console.log(this.props.widgetData.value3);
    // console.log(this.props.widgetData.value4);


    // highlight Buttons
    if (this.props.widgetData.stateIdType !== "number" || this.props.widgetData.hightlightExactValueOnly === true) {
      if (val == this.props.widgetData.value1) { highlightBtnNr = 1 };
      if (val == this.props.widgetData.value2) { highlightBtnNr = 2 };
      if (val == this.props.widgetData.value3) { highlightBtnNr = 3 };
      if (val == this.props.widgetData.value4) { highlightBtnNr = 4 };
    } else if (this.props.widgetData.stateIdType === "number") {
      if (val <= this.props.widgetData.value1) { highlightBtnNr = 1 };
      if (val > this.props.widgetData.value1 && val <= this.props.widgetData.value2) { highlightBtnNr = 2 };
      if (val > this.props.widgetData.value2 && val <= this.props.widgetData.value3) { highlightBtnNr = 3 };
      if (val > this.props.widgetData.value3) { highlightBtnNr = 4 };
    }
    // boolean
    if (this.props.widgetData.stateIdType === "boolean") {
      if (val.toString() == this.props.widgetData.value1) { highlightBtnNr = 1 };
      if (val.toString() == this.props.widgetData.value2) { highlightBtnNr = 2 };
      if (val.toString() == this.props.widgetData.value3) { highlightBtnNr = 3 };
      if (val.toString() == this.props.widgetData.value4) { highlightBtnNr = 4 };
    }

    // make icons for indicator
    let indicatorIcon = this.props.widgetData.icon1;
    let indicatorIconFamily = this.props.widgetData.iconFamily1;
    let indicatorColor = this.props.widgetData.indicatorColor1;

    if (highlightBtnNr === 2) {
      indicatorIcon = this.props.widgetData.icon2;
      indicatorIconFamily = this.props.widgetData.iconFamily2;
      indicatorColor = this.props.widgetData.indicatorColor2;
    } else if (highlightBtnNr === 3) {
      indicatorIcon = this.props.widgetData.icon3;
      indicatorIconFamily = this.props.widgetData.iconFamily3;
      indicatorColor = this.props.widgetData.indicatorColor3;
    } else if (highlightBtnNr === 4) {
      indicatorIcon = this.props.widgetData.icon4;
      indicatorIconFamily = this.props.widgetData.iconFamily4;
      indicatorColor = this.props.widgetData.indicatorColor4;
    }

    let indicatorWidgetData = {
      key: this.props.widgetData.UUID,
      UUID: this.props.widgetData.UUID,
      connected: this.props.widgetData.connected,
      socket: this.props.widgetData.socket,
      states: this.props.widgetData.states,
      title: this.props.widgetData.title,
      stateId: "undefined",
      stateIdType: "undefined",
      titleIcon: this.props.widgetData.titleIcon,
      titleIconFamily: this.props.widgetData.titleIconFamily,
      icon: indicatorIcon,
      iconFamily: indicatorIconFamily,
      colorWhenTrue: indicatorColor,
      colorWhenFalse: "#222222",
      alwaysTrue: true,
      timestamp: this.props.widgetData.timestamp
    };

    let valueswitcher = (
      <List id={this.props.widgetData.UUID}>
        {timestamp}
        <ListItem class="valueSwitcherBtnList">
          <Button
            class={"btn-" + this.props.widgetData.iconFamily1}
            disable-auto-styling={"disable-auto-styling"}
            modifier={highlightBtnNr === 1 ? "" : "outline"}
            onClick={this.sendValue1.bind(this)}
            disabled={this.props.widgetData.readOnly}
            style={{
              display: displayBtn1,
              width: btnWidth + "%",
              marginRight: btnMarginRight,
            }}
          >
            <span
              className={"valueSwitcherIcon min " + this.props.widgetData.iconFamily1 + " " + this.props.widgetData.icon1}
            ></span>
            <span className={"valueSwitcherValue " + this.hideTextClass}>
              {this.props.widgetData.value1.toString() +
                (this.props.widgetData.unit.length > 0 ? " " : "") +
                this.props.widgetData.unit}
            </span>
          </Button>
          <Button
            class={"btn-" + this.props.widgetData.iconFamily2}
            disable-auto-styling={"disable-auto-styling"}
            modifier={highlightBtnNr === 2 ? "" : "outline"}
            onClick={this.sendValue2.bind(this)}
            disabled={this.props.widgetData.readOnly}
            style={{
              display: displayBtn2,
              width: btnWidth + "%",
              marginRight: btnMarginRight,
            }}
          >
            <span
              className={"valueSwitcherIcon min " + this.props.widgetData.iconFamily2 + " " + this.props.widgetData.icon2}
            ></span>
            <span className={"valueSwitcherValue " + this.hideTextClass}>
              {this.props.widgetData.value2.toString() +
                (this.props.widgetData.unit.length > 0 ? " " : "") +
                this.props.widgetData.unit}
            </span>
          </Button>
          <Button
            class={"btn-" + this.props.widgetData.iconFamily3}
            disable-auto-styling={"disable-auto-styling"}
            modifier={highlightBtnNr === 3 ? "" : "outline"}
            onClick={this.sendValue3.bind(this)}
            disabled={this.props.widgetData.readOnly}
            style={{
              display: displayBtn3,
              width: btnWidth + "%",
              marginRight: btnMarginRight,
            }}
          >
            <span
              className={"valueSwitcherIcon min " + this.props.widgetData.iconFamily3 + " " + this.props.widgetData.icon3}
            ></span>
            <span className={"valueSwitcherValue " + this.hideTextClass}>
              {this.props.widgetData.value3.toString() +
                (this.props.widgetData.unit.length > 0 ? " " : "") +
                this.props.widgetData.unit}
            </span>
          </Button>
          <Button
            class={"btn-" + this.props.widgetData.iconFamily4}
            disable-auto-styling={"disable-auto-styling"}
            modifier={highlightBtnNr === 4 ? "" : "outline"}
            onClick={this.sendValue4.bind(this)}
            disabled={this.props.widgetData.readOnly}
            style={{
              display: displayBtn4,
              width: btnWidth + "%",
              marginRight: btnMarginRight,
            }}
          >
            <span
              className={"valueSwitcherIcon min " + this.props.widgetData.iconFamily4 + " " + this.props.widgetData.icon4}
            ></span>
            <span className={"valueSwitcherValue " + this.hideTextClass}>
              {this.props.widgetData.value4.toString() +
                (this.props.widgetData.unit.length > 0 ? " " : "") +
                this.props.widgetData.unit}
            </span>
          </Button>
        </ListItem>
      </List >
    );

    let indicator = (
      <Indicator
        widgetData={indicatorWidgetData}
      />
    );

    if (this.props.widgetData.showAsIndicator && this.props.widgetData.showAsIndicator === true) {
      return indicator;
    } else {
      return valueswitcher;
    }
  }
}
