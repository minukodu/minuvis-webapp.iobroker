import React from "react";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class CompactModeWrapper extends React.Component {
  render() {
    //console.debug("Render CompactModeWrapper");

    let minHeight = "40px";
    // if (this.props.title === "NONE") { 
    //   title = null
    //   minHeight = "40px"; 
    // }

    let title = this.props.title;
    let titleIcon = <Title title={"ICONONLY"} titleIcon={this.props.titleIcon}  titleIconFamily={this.props.titleIconFamily} compactMode={true} />;

    if (this.props.title === "ICONONLY") {
      title = "";
    } else if (this.props.title.indexOf("NOICON_") == 0) {
      title = this.props.title.substr(7); // cut 7 characters
      titleIcon = null;
    } else if (this.props.title === "NONE") {
      title = "";
      titleIcon = null;
    } 

    return (
      <ons-col 
      id={this.props.UUID}
      class={"compactModeWrapper"}>
        <ons-list>
          <ons-list-header>
            {title}
            <span
              className="right lastupdate"
              style={{ float: "right", paddingRight: "5px" }}
            >
              {moment().format("LLL")}
            </span>
          </ons-list-header>
        </ons-list>
        <ons-row style={{ flexDirection: "row", flexWrap: "nowrap" }}>
          <ons-col class="compactModeWrapperStart" style={{ flexBasis: "40px", minWidth: "80px" }}>
            <div style={{ position: "relative", minHeight: minHeight }}>
              {titleIcon}
            </div>
          </ons-col>
          <ons-col style={{ flexBasis: "auto", flexGrow: 1 }} class="compactMode">{this.props.children}</ons-col>
        </ons-row>

      </ons-col>
    );
  }
}
