import React from "react";
import { Button, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class ImgButton extends React.Component {
  constructor() {
    super();
    this.state = {
      val: "false",
      ts: moment(),
    };
  }

  sendValue() {

    // check Value and target-type
    var valueToSend = this.props.widgetData.setValue;
    if (this.props.widgetData.stateIdType === "boolean") {
      valueToSend = this.stringToBoolean(this.props.widgetData.setValue);
    } else if (this.props.widgetData.stateIdType === "number") {
      valueToSend = parseFloat(this.props.widgetData.setValue);
    }
    // Send
    console.log("imgButton Send: " + this.props.widgetData.stateId + ":" + valueToSend);
    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, valueToSend);

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
    // init
    // console.log("init imgButton");
    // console.log(this.props);
    let val = "false";
    let ts = moment();

    if (
      this.props.widgetData.states[this.props.widgetData.stateId] && 
      this.props.widgetData.states[this.props.widgetData.stateId].received === true ) {
      val = this.props.widgetData.states[this.props.widgetData.stateId].val;
      ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

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

    // check is equal
    if (val === null) {val = "false"};
    
    let valueString = val.toString();
    if (this.props.widgetData.stateIdType === "boolean" && val === true) {
      valueString = "true";
    }
    if (this.props.widgetData.stateIdType === "boolean" && val === false) {
      valueString = "false";
    }
    let equalClass = "notEqual";
    if (valueString == this.props.widgetData.setValue) {
      equalClass = "isEqual";
    }

    // check image
    let buttomImage = "no image";
    let imgStyle = { height: "100%", width: "auto" }; // scale 100% Width
    if ( this.props.widgetData.scaleWidth && this.props.widgetData.scaleWidth === true ) {
      imgStyle = { height: "auto", width: "100%" };
    } 
    if (this.props.widgetData.bgImage.length > 5) {
      buttomImage = (
        <img
          className={"imgButtonImage"}
          // style={{ width: "100%", height: "auto" }}
          style={imgStyle}
          src={this.props.widgetData.bgImage}
        />
      )
    }
    return (
      <List id={this.props.widgetData.UUID} style={{ height: "100%" }}>
        {timestamp}
        <ListItem style={{ height: "100%" }}>
          <div className="center">
            <div className={"imgButton imgButtonCenter " + equalClass} style={{ height: "95%", display: "grid" }}>
              <Button
                style={{ height: "100%", margin: "auto", padding: 0, background: "transparent" }}
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
