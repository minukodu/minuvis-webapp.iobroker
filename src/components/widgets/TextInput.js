import React from "react";
import { Input, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class TextInput extends React.Component {
  constructor() {
    super();
    this.state = {
      val: false,
      ts: moment(),
      showSubmit: "none",
      inputWidth: "99%"
    };
    this.val = "";
    this.waitForData = false;
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

  sendValue(e) {
    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, this.val);
    // State nachführen
    this.setState({
      showSubmit: "none",
      inputWidth: "99%",
      ts: moment(),
    });
    this.waitForData = true;
    // reset wait for data after 500ms
    setTimeout(() => { this.waitForData = false; }, 500)
  }

  sendValueByEnter(e) {
    // console.log("keypress textinput");
    // console.log(e.which);

    if (e.which == 13) {
      e.preventDefault();
      this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, this.val);
      // State nachführen
      this.setState({
        showSubmit: "none",
        inputWidth: "99%",
        ts: moment(),
      });
      console.log("Textinput hide submit");
      this.waitForData = true;
      // reset wait for data after 500ms
      setTimeout(() => { this.waitForData = false; }, 500)
    }
  }

  showSubmit(e) {
    this.val = e.target.value;
    this.setState({
      showSubmit: "inline-block",
      inputWidth: "80%",
    });
  }

  render() {

    let ts = moment();
    let val;


    // disbaled from connected or disabled-state
    let disabled = !this.props.widgetData.connected;
    if (
      this.props.widgetData.stateIdDisabled &&
      this.props.widgetData.stateIdDisabled != "undefined" &&
      this.props.widgetData.states[this.props.widgetData.stateIdDisabled] &&
      this.props.widgetData.states[this.props.widgetData.stateIdDisabled].received === true
    ) {
      disabled = disabled || this.stringToBoolean(this.props.widgetData.states[this.props.widgetData.stateIdDisabled].val);
    }
    // display from invisible-state
    let display = true;
    if (
      this.props.widgetData.stateIdInvisible &&
      this.props.widgetData.stateIdInvisible != "undefined" &&
      this.props.widgetData.states[this.props.widgetData.stateIdInvisible] &&
      this.props.widgetData.states[this.props.widgetData.stateIdInvisible].received === true
    ) {
      display = !this.stringToBoolean(this.props.widgetData.states[this.props.widgetData.stateIdInvisible].val);
    }

    if (this.state.showSubmit === "none" && this.waitForData === false) {
      // init
      console.log("init textinput")

      val = "";

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

      this.val = val || "";

    }

    ts = ts || moment();

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

    return (
      <List 
        id={this.props.widgetData.UUID}
        style={{ display: display?"block":"none" }} >
        {timestamp}
        <ListItem>
          <div className="center textinputwidget">
            <Input
              style={{ width: this.state.inputWidth }}
              value={this.val.toString()}
              disabled={disabled}
              onChange={this.showSubmit.bind(this)}
              onKeyPress={this.sendValueByEnter.bind(this)}
            ></Input>
            <span
              className="submitbutton"
              style={{ display: this.state.showSubmit }}
              onClick={this.sendValue.bind(this)}
            >
              <span className="pageIcon textinputSendIcon mdi-icon send-circle-outline"></span>
            </span>
          </div>
        </ListItem>
      </List>
    );
  }
}
