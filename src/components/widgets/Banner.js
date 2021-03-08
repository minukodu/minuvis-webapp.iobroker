import React from "react";
import { List, ListItem } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class Banner extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "no data",
      ts: moment(),
    };
  }

  componentWillMount() {
    // console.dir(this.props.states);
    // console.log(typeof this.props.states[this.props.config.stateId]);

    if (this.props.config.useBanner !== true ) { return; }

    if (typeof this.props.states[this.props.config.stateId] === "undefined") {
      if (this._stateId_subscribed === false) {
        // Subscribe state
        // console.log("Subscribe " + this.props.config.stateId);
        this.props.socket.emit("subscribe", this.props.config.stateId);
        this._stateId_subscribed = true;
        // Read state
        this.props.socket.emit(
          "getStates",
          [this.props.config.stateId],
          function (err, states) {
            // console.log("Received States");
            // console.dir(states);
            // eintragen
            this.setState({
              val: states[this.props.config.stateId].val,
              ts: states[this.props.config.stateId].ts,
            });
          }.bind(this)
        );
      }
    } else {
      // console.log("Read " + this.props.config.stateId);
      this.setState({
        val: this.props.states[this.props.config.stateId].val,
        ts: this.props.states[this.props.config.stateId].ts,
      });
    }

  }

  render() {
    // console.debug("Render banner");
    // console.log(this.props);

    // init
    let val = "no data";
    let ts = moment();
    // read value and timestamp from props if available
    if (this.props.states[this.props.config.stateId] && typeof this.props.states[this.props.config.stateId] !== "undefined") {
      val = this.props.states[this.props.config.stateId].val;
      ts = this.props.states[this.props.config.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }


    if (this.props.config.useBanner === true && val && val.length > 3) {
      return (
        <List className="banner">
          <ListItem>
            <div style={{ width: 100 + "%" }}>
              <div
                className="banner"
                style={{ width: 100 + "%" }}
                dangerouslySetInnerHTML={{ __html: val }}
              ></div>
            </div>
          </ListItem>
        </List>
      );
    } else {
      return null;
    }


  }
}
