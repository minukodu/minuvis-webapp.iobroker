import React from "react";
import { List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class IMGOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgkey: 0,
      lastUpdateDate: Date.now(),
      val: "no data",
      ts: moment(),
    };

    setInterval(
      () =>
        this.setState((s) => ({
          imgkey: s.imgkey + 1,
          lastUpdateDate: Date.now(),
        })),
      this.props.IMGUpdateInterval
    );
  }

  componentWillMount() {
    // console.dir(this.props.states);
    // console.log(typeof this.props.states[this.props.stateId]);
    if (this.props.urlFromState && this.props.urlFromState === true) {
      if (this.props.stateId && this.props.stateId.length > 5) {
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
    }

  }

  render() {
    // console.log("render ImgOutput");
    // console.log(this.state);
    // console.log(this.props.stateId);
    // console.log(this.props.states[this.props.stateId].val);

    let ts = this.state.ts || moment();

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

    let imgUrl = this.props.IMGUrl;
    if ( this.props.urlFromState && this.props.urlFromState === true ) {
      imgUrl = this.props.states[this.props.stateId].val || "";
    }

    return (
      <List id={this.props.UUID} className="imgoutput">
        {timestamp}
        <ListItem>
          <div className="imgoutput">
            <img
              key={this.state.imgKey}
              src={imgUrl + "?ts=" + this.state.lastUpdateDate}
            />
          </div>
        </ListItem>
      </List>
    );
  }
}
