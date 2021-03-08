import React from "react";
import { Button, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class ImgButton extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "false",
      ts: moment(),
    };
  }

  sendValue() {

    // check Value and target-type
    var valueToSend = this.props.setValue;
    if (this.props.stateIdType === "boolean") {
      valueToSend = this.stringToBoolean(this.props.setValue);
    } else if (this.props.stateIdType === "number") {
      valueToSend = parseFloat(this.props.setValue);
    }
    // Send
    console.log("imgButton Send: " + this.props.stateId + ":" + valueToSend);
    this.props.socket.emit("setState", this.props.stateId, valueToSend);

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
    // console.log("componentWillMount ImgButton");

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
      if (this.props.states[this.props.stateId] != null) {
        this.setState({
          val: this.props.states[this.props.stateId].val,
          ts: this.props.states[this.props.stateId].ts,
        });
      };
    }

  }

  render() {
    // init
    // console.log(this.props);
    let val = "false";
    let ts = moment();

    if (typeof this.props.states[this.props.stateId] !== "undefined" && this.props.states[this.props.stateId] != null) {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    let timestamp = null;
    if (this.props.timestamp && this.props.timestamp === true) {
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

    // check is equal
    if (val === null) {val = "false"};
    
    let valueString = val.toString();
    if (this.props.stateIdType === "boolean" && val === true) {
      valueString = "true";
    }
    if (this.props.stateIdType === "boolean" && val === false) {
      valueString = "false";
    }
    let equalClass = "notEqual";
    if (valueString == this.props.setValue) {
      equalClass = "isEqual";
    }

    // check image
    let buttomImage = "no image";
    if (this.props.bgImage.length > 5) {
      buttomImage = (
        <img
          className="imgButtonImage"
          style={{ width: "100%", height: "auto" }}
          src={this.props.bgImage}
        />
      )
    }
    return (
      <List id={this.props.UUID} style={{ height: "100%" }}>
        {timestamp}
        <ListItem style={{ height: "100%" }}>
          <div className="center">
            <div className={"imgButton imgButtonCenter " + equalClass}>
              <Button
                style={{ margin: "auto", padding: 0, background: "transparent" }}
                onClick={this.sendValue.bind(this)} >
                {buttomImage}
              </Button>
            </div>
          </div>
        </ListItem>
      </List>
    );
  }
}
