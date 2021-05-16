import React from "react";
import { List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

export default class HtmlOutput extends React.Component {
  constructor() {
    super();
    this.state = {
      val: "no data",
      ts: moment(),
    };
  }

  render() {
    //console.debug("Render HTMLOutput");

    // init
    let val = "no data";
    let ts = moment();
    // read value and timestamp from props if available
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

    // inject css
    let styleToInject = ""; // now globally in myPage.js "<style>" + CSSJSON.toCSS(this.props.widgetData.css) + "</style>";

    val = styleToInject + val;

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
      <List id={this.props.widgetData.UUID} class={"htmloutput"}>
          {timestamp}
          <ListItem>
            <div style={{ width: 100 + "%" }}>
              <div
                className="htmloutput"
                style={{ width: 100 + "%" }}
                dangerouslySetInnerHTML={{ __html: val }}
              ></div>
            </div>
          </ListItem>
      </List>
    );
  }
}
