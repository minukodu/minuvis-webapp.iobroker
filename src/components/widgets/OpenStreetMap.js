import React from "react";
import { List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class OpenStreetMap extends React.Component {
  constructor(props) {
    super(props);
    this.osmBaseUrl = "https://www.openstreetmap.org/export/embed.html";
    this.osmLayer = "mapnik";
    this.osmBbox =
      "8.747091293334963,53.05050091811825,8.860387802124025,53.09794104139581";
    this.lat = 53.07422751310222;
    this.lng = 8.803739547729492;
    this.val = "[" + this.lng + "," + this.lat + "]";
    this.ts = moment();
    this.zommFaktor = 10000;
    this.boxZoom = 50 / this.zommFaktor;
    this.setState({
      val: this.val,
      ts: this.ts,
    });
  }

  componentWillMount() {
    // console.dir(this.props.states);
    // console.log(typeof this.props.states[this.props.stateId]);

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
    console.debug("Render OpenstreetMap");
    // console.dir(this.props);

    // read value and timestamp from props if available
    if (
      this.props.states[this.props.stateId] &&
      typeof this.props.states[this.props.stateId] !== "undefined"
    ) {
      this.val = this.props.states[this.props.stateId].val;
      this.ts = this.props.states[this.props.stateId].ts;
    }

    console.log(this.val);
    console.log(this.props.zoom);

    this.boxZoom = parseFloat(this.props.zoom) / this.zommFaktor;

    try {
      let objVal = JSON.parse(this.val);
      console.log(objVal);
      if (objVal.lat) {
        this.lat = objVal.lat;
      } else {
        this.lat = objVal[1];
      }
      if (objVal.lng) {
        this.lng = objVal.lng;
      } else {
        this.lng = objVal[0];
      }
      this.osmBbox = (this.lng - this.boxZoom) + "," + (this.lat - this.boxZoom) + "," + (this.lng + this.boxZoom) + "," + (this.lat + this.boxZoom);
    } catch (e) { }

    let src =
      this.osmBaseUrl +
      "?bbox=" +
      this.osmBbox +
      "&layer=" +
      this.osmLayer +
      "&marker=" +
      this.lat +
      "," +
      this.lng;

    let timestamp = null;
    if (this.props.timestamp && this.props.timestamp === true) {
      timestamp = (
        <ListHeader>
          <span
            className="right lastupdate"
            style={{ float: "right", paddingRight: "5px" }}
          >
            {moment().format("DD.MM.YY HH.mm")}
          </span>
        </ListHeader>
      );
    }
    let height = this.props.widgetHeight * this.props.rowHeight;
    height = height + "px";

    return (
      <List id={this.props.UUID} class={"openstreetmap iframeoutput"}>
          {timestamp}
          <ListItem>
            <div
              className="openstreetmap iframeoutput"
              style={{
                width: "100%"
              }}
            >
              <iframe
                src={src}
                style={{
                  width: "100%",
                  height: height,
                }}
                frameBorder="0"
              />
            </div>
          </ListItem>
      </List>
    );
  }
}
