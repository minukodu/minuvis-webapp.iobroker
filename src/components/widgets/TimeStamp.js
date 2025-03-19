import React from "react";
import moment from "moment";
moment.locale("de-DE");

export default class TimeStamp extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: false,
      ts: moment(),
    };
  }

  UNSAFE_componentWillMount() {

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
    let val = false;
    let ts = moment();
   

    if (typeof this.props.states[this.props.stateId] !== "undefined") {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    let header = (
      <ons-list-header class="timestamp">
        <span
          className="right lastupdate"
          style={{ float: "right", paddingRight: "5px" }}
        >
          {moment(ts).format("LLL")}
        </span>
      </ons-list-header>
    );

    return (
      <ons-col id={this.props.UUID}>
        <ons-list>
          {header}
        </ons-list>
      </ons-col>
    );
  }
}
