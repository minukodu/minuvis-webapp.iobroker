import React from "react";
import { List, ListItem, ListHeader } from "react-onsenui";
import { HuePicker } from "react-color";
import moment from "moment";
moment.locale("de-DE");

export default class HueColorPicker extends React.Component {
  constructor() {
    super();
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
    if (this.props.widgetData.formatWithWhite === true) {
      valToSend = valToSend + "00";
    }

    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, valToSend);
    // console.debug(this.props.widgetData.stateId + " :: " + valToSend);
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
    this.setState({
      val: color.hex,
    });
    // console.debug("Change HueColorPicker");
    // console.log("this.changing: " + this.changing);
  };

  render() {
    // console.debug("Render HueColorPicker");
    // console.log("this.changing: " + this.changing);
    //console.log(this.props);

    // read value and timestamp from props if available
    if (
      this.props.widgetData.states[this.props.widgetData.stateId] &&
      this.props.widgetData.states[this.props.widgetData.stateId].received === true &&
      this.changing === false
    ) {
      this.val = this.props.widgetData.states[this.props.widgetData.stateId].val;
      this.ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    } else {
      // read from this.state
      this.val = this.state.val;
      this.ts = this.state.ts;
    }

    if (this.val === null) {
      this.val = "#ff0000";
    }
    if (typeof(this.val) !== "string") { this.val = "#ff0000" };
    this.val = this.val.substring(0, 7); //cut all other characters there is no white

    console.log("val: " + this.val);

    let timestamp = null;
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{ float: "right", paddingRight: "5px" }}
          >
            {moment(this.ts).format("DD.MM.YY HH:mm")}
          </span>
        </ListHeader>
      );
    }

    return (
      <List id={this.props.widgetData.UUID}>
        {timestamp}
        <ListItem>
          <div className="hue-picker center">
            <div style={{ margin: "auto", width: "80%" }}>
              <HuePicker
                color={this.val}
                onChangeComplete={this.handleRBGColorChangeComplete}
                onChange={this.handleRBGColorChange}
                height={"7px"}
                width={"100%"}
              />
            </div>
          </div>
        </ListItem>
      </List>
    );
  }
}
