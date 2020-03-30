import React from "react";
import { Button } from "react-onsenui";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class ValueSwitcher extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: 0,
      ts: moment()
    };
  }

  sendValueElement(e) {
    this.props.socket.emit("setState", this.props.stateId, e.target.value);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment()
    });
  }

  sendValue(value) {
    this.props.socket.emit("setState", this.props.stateId, value);
    // State nachführen
    this.setState({
      val: value,
      ts: moment()
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
              ts: states[this.props.stateId].ts
            });
          }.bind(this)
        );
      }
    } else {
      // console.log("Read " + this.props.stateId);
      this.setState({
        val: this.props.states[this.props.stateId].val,
        ts: this.props.states[this.props.stateId].ts
      });
    }

    // console.log("Switch connected:");
    // console.log(this.props);
    // console.log(this.props.connected);
    // console.log(!this.props.connected);
  }

  render() {
    // init
    let val = 0;
    let ts = moment();
    // read value and timestamp from props if available
    if (
      typeof this.props.states[this.props.stateId] !== "undefined" &&
      this.props.states[this.props.stateId]
    ) {
      val = this.props.states[this.props.stateId].val || 0;
      ts = this.props.states[this.props.stateId].ts || moment();
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
    }
    else if (this.props.nbOfButtons < 3) {
      displayBtn3 = "none";
      displayBtn4 = "none";
      btnWidth = 96/2 ;
    }
    else if (this.props.nbOfButtons < 4) {
      displayBtn4 = "none";
      btnWidth = 94/3;
    }

    console.log("Render ValueSwitcher");
    console.log('this.isNumeric(val) ? "number" : "text"');
    console.log(this.isNumeric(val) ? "number" : "text");
    console.log(val);
   
    let title = <ons-list-item>
                  <Title title={this.props.title} titleIcon={this.props.titleIcon} />
                  <div className="right noLowLightIfDisabled">
                    <output
                      disable-auto-styling={"disable-auto-styling"}
                      value={val.toString()}
                    >
                      {val.toString() + ((this.props.unit.length > 0) ? " " : "") + this.props.unit}
                    </output>
                  </div>
                </ons-list-item>

    if (this.props.title == "NONE") {
      title = null;
    }

    return (
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
          <ons-list-item className="valueSwitcherBtnList">
            <Button
              disable-auto-styling={"disable-auto-styling"}
              modifier={(val == this.props.value1)?"":"outline"}
              onClick={this.sendValue1.bind(this)}
              style={{ display: displayBtn1, width: btnWidth + "%", marginRight: btnMarginRight }}
            >
              <span
                className={
                  "valueSwitcherIcon min mfd-icon " + this.props.icon1
                }
              ></span>
              <span className={"valueSwitcherValue"}>
                {this.props.value1.toString() + ((this.props.unit.length > 0) ? " " : "") + this.props.unit}
              </span>
            </Button>
            <Button
              disable-auto-styling={"disable-auto-styling"}
              modifier={(val == this.props.value2)?"":"outline"}
              onClick={this.sendValue2.bind(this)}
              style={{ display: displayBtn2, width: btnWidth + "%", marginRight: btnMarginRight }}
            >
              <span
                className={
                  "valueSwitcherIcon min mfd-icon " + this.props.icon2
                }
              ></span>
              <span className={"valueSwitcherValue"}>
                {this.props.value2.toString() + ((this.props.unit.length > 0) ? " " : "") + this.props.unit}
              </span>
            </Button>
            <Button
              disable-auto-styling={"disable-auto-styling"}
              modifier={(val == this.props.value3)?"":"outline"}
              onClick={this.sendValue3.bind(this)}
              style={{ display: displayBtn3, width: btnWidth + "%", marginRight: btnMarginRight }}
            >
              <span
                className={
                  "valueSwitcherIcon min mfd-icon " + this.props.icon3
                }
              ></span>
              <span className={"valueSwitcherValue"}>
                {this.props.value3.toString() + ((this.props.unit.length > 0) ? " " : "") + this.props.unit}
              </span>
            </Button>
            <Button
              disable-auto-styling={"disable-auto-styling"}
              modifier={(val == this.props.value4)?"":"outline"}
              onClick={this.sendValue4.bind(this)}
              style={{ display: displayBtn4, width: btnWidth + "%", marginRight: btnMarginRight }}
            >
              <span
                className={
                  "valueSwitcherIcon min mfd-icon " + this.props.icon4
                }
              ></span>
              <span className={"valueSwitcherValue"}>
                {this.props.value4.toString() + ((this.props.unit.length > 0) ? " " : "") + this.props.unit}
              </span>
            </Button>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
