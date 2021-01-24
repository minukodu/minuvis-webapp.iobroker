import React from "react";
import { Input } from "react-onsenui";
import InputRange from 'react-input-range';
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

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
  }

  RangeOnChange(value) {
    let valueToSend = value;
    if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(value);
    }
    // Send only if not updateOnComplete
    if ( this.props.updateOnComplete === false ) {
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
    console.debug("RangeOnChangeComplete");
		console.debug(this.props.stateId + " :: " + value);
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
      valueToSend = parseInt(e.target.value, 10);
    }

    this.props.socket.emit("setState", this.props.stateId, valueToSend);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
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

    console.log("this.val: " + this.val);
    console.log("this.ts: " + this.ts);

    let maxIcon = this.props.maxIcon || "text_max";
    let minIcon = this.props.minIcon || "text_min";

    let title = (
      <ons-list-item>
        <Title
          title={this.props.title}
          titleIcon={this.props.titleIcon}
          titleIconFamily={this.props.titleIconFamily}
        />
        <div className="right">
          <Input
            disable-auto-styling
            disabled={!this.props.connected}
            onChange={this.sendValue.bind(this)}
            type="number"
            placeholder=""
            value={this.val.toString()}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
          ></Input>
          {this.props.unit}
        </div>
      </ons-list-item>
    );

    if (this.props.title == "NONE") {
      title = null;
    }

    let header = (
      <ons-list-header>
        <span
          className="right lastupdate"
          style={{ float: "right", paddingRight: "5px" }}
        >
          {moment(this.ts).format("LLL")}
        </span>
      </ons-list-header>
    );

    let compactModeClass = "";
    let disableAutoStyling = "true";
    let modifier = null;

    if (this.props.compactMode === true) {
      title = null;
      header = null;
      compactModeClass = "compactMode";
      disableAutoStyling = "false";
      modifier = "material";

    }

    return (
      <ons-col id={this.props.UUID} class={"sliderWidget " + compactModeClass} >
        <ons-list>
          {header}
          {title}
          <ons-list-item style={{ padding: 0 }}>
            <div style={{ display: "flex", width: "100%", flexDirection: "row", flexWrap: "nowrap" }}>
              <ons-col
                class={"sliderIconMin"}
                style={{ flexBasis: "50px", minWidth: "50px" }}
              >
                <span
                  className={
                    "sliderIcon min  " +
                    compactModeClass +
                    " " +
                    this.props.minIconFamily +
                    " " +
                    minIcon
                  }
                ></span>
              </ons-col>
              <ons-col style={{ minWidthhh: 80 + "%", borderLeft: "none", flexBasis: "auto", flexGrow: 1, alignSelf: "center" }}>
                <InputRange
                  formatLabel={value => `${value} ${this.props.unit}`}
                  disabled={!this.props.connected}
                  maxValue={this.props.max}
                  minValue={this.props.min}
                  step={this.props.step}
                  value={parseFloat(this.val)}
                  onChange={this.RangeOnChange.bind(this)}
                  onChangeComplete={this.RangeOnChangeComplete.bind(this)}
                  onChangeStart={this.RangeOnChangeStart.bind(this)}
                  className={compactModeClass}
                  style={{ width: 100 + "%" }}
                />
              </ons-col>
              <ons-col
                class={"sliderIconMax"}
                style={{ flexBasis: "50px", minWidth: "50px" }}
              >
                <span
                  className={
                    "sliderIcon max " +
                    compactModeClass +
                    " " +
                    this.props.maxIconFamily +
                    " " +
                    maxIcon
                  }
                ></span>
              </ons-col>
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
