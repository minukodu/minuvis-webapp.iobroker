import React from "react";
import { HuePicker } from "react-color";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class HueColorPicker extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "#ff0000",
      ts: moment(),
    };
    this.ts = moment();
    this.val = "#FF0000";
    this.changing = false;
  }

  handleRBGColorChangeComplete = (color, event) => {
    var valToSend = color.hex;
    if (this.props.formatWithWhite === true) {
      valToSend = valToSend + "00";
    }

    this.props.socket.emit("setState", this.props.stateId, valToSend);
    // console.debug(this.props.stateId + " :: " + valToSend);
    // State nachführen
    this.setState({
      val: color.hex,
      ts: moment(),
    });
    this.changing = false;
    // console.debug("ChangeComplete HueColorPicker");
    // console.log("this.changing: " + this.changing);
  };

  handleRBGColorChange = (color, event) => {
    this.changing = true;
    this.val = color.hex;
    // console.debug("Change HueColorPicker");
    // console.log("this.changing: " + this.changing);
  };

  componentWillMount() {
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
    // console.debug("Render HueColorPicker");
    // console.log("this.changing: " + this.changing);
    //console.log(this.props);

    // read value and timestamp from props if available
    if (
      this.props.states[this.props.stateId] &&
      typeof this.props.states[this.props.stateId] !== "undefined" &&
      this.changing === false
    ) {
      this.val = this.props.states[this.props.stateId].val;
      this.ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      this.val = this.state.val;
      this.ts = this.state.ts;
    }

    if (this.val === null) {
      this.val = "#ff0000";
    }
    this.val = this.val.substring(0, 7); //cut all other characters there is no white

    console.log("val: " + this.val);

    let title = "";
    if (this.props.title !== "NONE") {
      title = this.props.title;
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

    if (this.props.compactMode === true) {
      header = null;
      compactModeClass = "compactMode";
    }

    return (
      <ons-col id={this.props.UUID} class={compactModeClass}>
        <ons-list>
          {header}
          <ons-list-item>
            <Title
              title={this.props.title}
              titleIcon={this.props.titleIcon}
              titleIconFamily={this.props.titleIconFamily}
              compactMode={this.props.compactMode}
            />
            <div className="hue-picker right">
              <HuePicker
                color={this.val}
                onChangeComplete={this.handleRBGColorChangeComplete}
                onChange={this.handleRBGColorChange}
                height={"7px"}
              />
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
