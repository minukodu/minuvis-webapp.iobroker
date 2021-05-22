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
    };
  }

  sendValue(e) {
    // onChange TextInput
    console.log("onChange TextInput");
    console.log(e);
    console.log(e.target.value);
    this.props.widgetData.socket.emit("setState", this.props.widgetData.stateId, e.target.value);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
  }

  render() {
    // init
    let val = "";
    let ts = moment();

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

    val = val || "";
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
      <List id={this.props.widgetData.UUID}>
        {timestamp}
        <ListItem>
          <div className="center">
            <Input
              style={{ width: "99%" }}
              value={val.toString()}
              disabled={!this.props.widgetData.connected}
              onChange={this.sendValue.bind(this)}
            ></Input>
          </div>
        </ListItem>
      </List>
    );
  }
}
