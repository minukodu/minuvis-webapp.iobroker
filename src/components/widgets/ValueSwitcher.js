import React from "react";
import { Button } from "react-onsenui";
import Title from "./Title";
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
      valueToSend = parseInt(e.target.value, 10);
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
      valueToSend = parseInt(value, 10);
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

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
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
      val = this.props.states[this.props.stateId].val || 0;
      ts = this.props.states[this.props.stateId].ts || moment();
    } else {
      // read from this.state
      val = this.state.val || 0;
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
    console.log('this.isNumeric(val) ? "number" : "text"');
    console.log(this.isNumeric(val) ? "number" : "text");
    console.log(val);

    let valueText = (
      <div className="right noLowLightIfDisabled">
        <output
          disable-auto-styling={"disable-auto-styling"}
          value={val.toString()}
        >
          {val.toString() +
            (this.props.unit.length > 0 ? " " : "") +
            this.props.unit}
        </output>
      </div>
    );

    if (this.props.hideValue === true) {
      valueText = null;
    }

    let title = (
      <ons-list-item>
        <Title
          title={this.props.title}
          titleIcon={this.props.titleIcon}
          titleIconFamily={this.props.titleIconFamily}
        />
        {valueText}
      </ons-list-item>
    );

    if (this.props.title == "NONE") {
      title = null;
    }

    this.hideTextClass = "";
    if (this.props.hideText && this.props.hideText === true) {
      this.hideTextClass = "hidden";
    }
    console.log("############ hideText");
    console.log(this.props.hideText);
    console.log(this.hideTextClass);

    // highlight Buttons
    if ( this.props.stateIdType !== "number" || this.props.hightlightExactValueOnly === true ) {
      if ( val == this.props.value1 ) { highlightBtnNr = 1 };
      if ( val == this.props.value2 ) { highlightBtnNr = 2 };
      if ( val == this.props.value3 ) { highlightBtnNr = 3 };
      if ( val == this.props.value4 ) { highlightBtnNr = 4 };
    } else if ( this.props.stateIdType === "number" ) {
      if ( val <= this.props.value1 ) { highlightBtnNr = 1 };
      if ( val > this.props.value1 && val <= this.props.value2 ) { highlightBtnNr = 2 };
      if ( val > this.props.value2 && val <= this.props.value3 ) { highlightBtnNr = 3 };
      if ( val > this.props.value3 ) { highlightBtnNr = 4 };
    } 


    // make icons for indicator
    let indicatorIcon = this.props.icon1;
    let indicatorIconFamily = this.props.iconFamily1;
    let indicatorColor = this.props.indicatorColor1;
    
    if ( highlightBtnNr === 2 ) {
      indicatorIcon = this.props.icon2;
      indicatorIconFamily = this.props.iconFamily2;
      indicatorColor = this.props.indicatorColor2;
    } else if ( highlightBtnNr === 3 ) {
      indicatorIcon = this.props.icon3;
      indicatorIconFamily = this.props.iconFamily3;
      indicatorColor = this.props.indicatorColor3;
    } else if ( highlightBtnNr === 4 ) {
      indicatorIcon = this.props.icon4;
      indicatorIconFamily = this.props.iconFamily4;
      indicatorColor = this.props.indicatorColor4;
    }


    let valueswitcher = (
      <ons-col id={this.props.UUID}>
        <ons-list>
          <ons-list-header>
            <span
              className="right lastupdate"
              style={{ float: "right", paddingRight: "5px" }}
            >
              {moment(ts).format("LLL")}
            </span>
          </ons-list-header>
          {title}
          <ons-list-item class="valueSwitcherBtnList">
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
                className={"valueSwitcherIcon min " + this.props.iconFamily1 + " " + this.props.icon1}
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
                className={"valueSwitcherIcon min " + this.props.iconFamily2 + " " + this.props.icon2}
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
                className={"valueSwitcherIcon min " + this.props.iconFamily3 + " " + this.props.icon3}
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
                className={"valueSwitcherIcon min " + this.props.iconFamily4 + " " + this.props.icon4}
              ></span>
              <span className={"valueSwitcherValue " + this.hideTextClass}>
                {this.props.value4.toString() +
                  (this.props.unit.length > 0 ? " " : "") +
                  this.props.unit}
              </span>
            </Button>
          </ons-list-item>
        </ons-list>
      </ons-col>
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
        compactMode={false}
      />
    );

    if (this.props.showAsIndicator && this.props.showAsIndicator === true ) {
      return indicator;
    } else {
      return valueswitcher;
    } 
  }
}
