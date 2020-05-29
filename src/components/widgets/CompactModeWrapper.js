import React from "react";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class CompactModeWrapper extends React.Component {
  render() {
    //console.debug("Render CompactModeWrapper");
    let title = (
      <Title title={"ICONONLY"} titleIcon={this.props.titleIcon} />
    );
    if (this.props.title === "NONE") { title = null; }

    return (
      <ons-col id={this.props.UUID}>
        <ons-list>
          <ons-list-header>
            <span
              className="right lastupdate"
              style={{ float: "right", paddingRight: "5px" }}
            >
              {moment().format("LLL")}
            </span>
          </ons-list-header>
        </ons-list>
        <ons-row style={{ flexDirection: "row" }}>
          <ons-col style={{ minWidth: "25%", width: "25%" }}>
            <div style={{ position: "absolute" }}>
              {title}
            </div>
          </ons-col>
          <ons-col style={{ minWidth: "75%", width: "75%" }} class="compactMode">{this.props.children}</ons-col>
        </ons-row>

      </ons-col>
    );
  }
}
