import React from "react";
import { List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class IframeOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { iframeKey: 0, lastUpdateDate: Date.now() };
    setInterval(
      () =>
        this.setState((s) => ({
          iframeKey: s.iframeKey + 1,
          lastUpdateDate: Date.now(),
        })),
      this.props.widgetData.updateTimeSek * 1000
    );
  }
  render() {
    // console.log("render Iframe");
    // console.log(this.props);
    
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
      <List id={this.props.widgetData.UUID} class={"iframeoutput"}>
        {timestamp}
        <ListItem>
          <div className="iframeoutput" style={{ width: 100 + "%" }}>
            <iframe
              key={this.state.iframeKey}
              src={this.props.widgetData.url}
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
