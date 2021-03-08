import React from "react";
import { Input, List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class TextInput extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
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
    this.props.socket.emit("setState", this.props.stateId, e.target.value);
    // State nachführen
    this.setState({
      val: e.target.value,
      ts: moment(),
    });
  }

  componentWillMount() {
    // console.log("componentWillMount Switch");

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
  }

  render() {
    // init
    let val = "";
    let ts = moment();

    if (this.props.states[this.props.stateId] && typeof this.props.states[this.props.stateId] !== "undefined") {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    val = val || "";
    ts = ts || moment();

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

    return (
      <List id={this.props.UUID}>
        {timestamp}
        <ListItem>
          <div className="center">
            <Input
              style={{ width: "99%" }}
              value={val.toString()}
              disabled={!this.props.connected}
              onChange={this.sendValue.bind(this)}
            ></Input>
          </div>
        </ListItem>
      </List>
    );
  }
}
