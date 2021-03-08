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
      this.props.IframeUpdateInterval
    );
  }
  render() {
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
      <List id={this.props.UUID} class={"iframeoutput"}>
        {timestamp}
        <ListItem>
          <div className="iframeoutput" style={{ width: 100 + "%" }}>
            <iframe
              key={this.state.iframeKey}
              src={this.props.IframeUrl}
              style={{
                width: this.props.IframeWidth,
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
