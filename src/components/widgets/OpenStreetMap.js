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
    this.zoomFactor = 10000;
    this.boxZoom = 50 / this.zoomFactor;
  }

  render() {
    console.debug("Render OpenstreetMap");
    // console.dir(this.props);

    // read value and timestamp from props if available
    if (
      this.props.widgetData.states[this.props.widgetData.stateId] &&
      this.props.widgetData.states[this.props.widgetData.stateId].received === true
    ) {
      this.val = this.props.widgetData.states[this.props.widgetData.stateId].val;
      this.ts = this.props.widgetData.states[this.props.widgetData.stateId].ts;
    }

    console.log(this.val);
    console.log(this.props.widgetData.zoom);

    this.boxZoom = parseFloat(this.props.widgetData.zoom) / this.zoomFactor;

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
    if (this.props.widgetData.timestamp && this.props.widgetData.timestamp === true) {
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
    let height = this.props.widgetData.widgetHeight * this.props.widgetData.rowHeight;
    height = height + "px";

    return (
      <List id={this.props.widgetData.UUID} class={"openstreetmap iframeoutput"}>
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
