import React from "react";
import { Input } from "react-onsenui";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class ColorPicker extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "#ff0000",
      ts: moment(),
    };
  }

  sendValue(e) {
    // only if type = "input"; chrome on android fires 2 events: "change" + "input"
    console.log("change ColorInput");
    console.log(e.target.value);

    var valToSend = e.target.value;
    // if (this.props.formatWithWhite === true) {
    //   valToSend = valToSend + "00";
    // }

    if (e.type === "input") {

      this.props.socket.emit("setState", this.props.stateId, valToSend)
      // State nachführen
      this.setState({
        val: e.target.value, // not valToSend
        ts: moment(),
      });
    }
  }

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
    // console.debug("Render TimePicker");
    // console.debug(this.props);

    // init
    let val = "#ff0000";
    let ts = moment();
    // read value and timestamp from props if available
    if (typeof this.props.states[this.props.stateId] !== "undefined") {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    if (val === null) { val = "#ff0000"};
    val = val.substring(0, 7); //cut all other characters there is no white

    let title = "";
    if (this.props.title !== "NONE") {
      title = this.props.title;
    }

    let header =
      <ons-list-header>
        <span
          className="right lastupdate"
          style={{ float: "right", paddingRight: "5px" }}
        >
          {moment(ts).format("LLL")}
        </span>
      </ons-list-header>

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
            <div className="right">
              <Input
                disable-auto-styling
                data-iobroker={this.props.stateId}
                onChange={this.sendValue.bind(this)}
                type={"color"}
                value={val}
                className={"colorInput"}
              ></Input>
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
