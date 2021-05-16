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
      30000 // 5 minutes
    );
  }

  render() {
    // console.log("render ImgOutput");
    // console.log(this.state);
    // console.log(this.props.widgetData.stateId);
    // console.log(this.props.widgetData.states[this.props.widgetData.stateId].val);

    let ts = this.state.ts || moment();

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

    let imgUrl = this.props.widgetData.url;
    if (
      this.props.widgetData.urlFromState &&
      this.props.widgetData.urlFromState === true
    ) {
      if (
        this.props.widgetData.states[this.props.widgetData.stateId] &&
        this.props.widgetData.states[this.props.widgetData.stateId].received === true
      ) {
        imgUrl = this.props.widgetData.states[this.props.widgetData.stateId].val;
      }
    }
    let imgStyle = { height: "100%", width: "auto" }; // scale 100% Width
    if (this.props.widgetData.scaleWidth && this.props.widgetData.scaleWidth === true) {
      imgStyle = { height: "auto", width: "100%" };
    }

    return (
      <List id={this.props.widgetData.UUID} style={{ height: "100%" }} className="imgoutput">
        {timestamp}
        <ListItem style={{ height: "100%" }}>
          <div className="imgoutput" style={{ height: "100%" }}>
            <img
              key={this.state.imgKey}
              style={imgStyle}
              src={imgUrl + "?ts=" + this.state.lastUpdateDate}
            />
          </div>
        </ListItem>
      </List>
    );
  }
}
