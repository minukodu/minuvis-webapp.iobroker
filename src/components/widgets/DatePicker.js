import React from "react";
import { Input, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class DatePicker extends React.Component {
  constructor() {
    super();
    this.state = {
      val: "01.01.1970",
      ts: moment(),
    };
  }

  sendValue(e) {
    // only if type = "input"; chrome on android fires 2 events: "change" + "input"
    if (e.type === "input") {

      let formattedOutput = moment(e.target.value).format(this.props.widgetData.format);

      this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, formattedOutput);
      console.log("DatePicker NewValue:");
      console.log(e);
      console.log("##############" + formattedOutput);
      // State nachführen
      this.setState({
        val: e.target.value,
        ts: moment(),
      });
    }
  }

  render() {
    console.log("Render DatePicker");
    // console.log(this.props.widgetData.format)

    // init
    let val = "01.01.1970";
    let ts = moment();
    // read value and timestamp from props if available
    if (
      this.props.widgetData.states[this.props.widgetData.stateId] &&
      this.props.widgetData.states[this.props.widgetData.stateId].received === true
    ) {
      val = this.props.widgetData.states[this.props.widgetData.stateId].val;
      ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
      val = moment(val, this.props.widgetData.format).format("YYYY-MM-DD");
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
      val = moment(val).format("YYYY-MM-DD");
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

    return (
      <List id={this.props.widgetData.UUID}>
        {timestamp}
        <ListItem>
          <div className="right">
            <div style={{ margin: "auto", width: "100%" }}>
              <Input
                disable-auto-styling
                data-iobroker={this.props.widgetData.stateId}
                onChange={this.sendValue.bind(this)}
                type={"date"}
                value={val}
              ></Input>
            </div>
          </div>
        </ListItem>
      </List>
    );
  }
}
