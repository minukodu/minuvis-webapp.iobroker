import React from "react";

export default class Title extends React.Component {
  render() {
    let fontSize = "100%";
    let compactModeClass = "";
    let titleIconClass = "titleIcon";

    if (this.props.compactMode === true) {
      fontSize = "80%";
      compactModeClass = "compactMode";
    }

    let title = "";
    let titleIcon = this.props.titleIcon || "audio_play";
    let titleIconFamily = this.props.titleIconFamily || "mfd-icon";

    if (this.props.title === "ICONONLY") {
      title = "";
    } else if (this.props.title.indexOf("NOICON_") == 0) {
      title = this.props.title.substr(7); // cut 7 characters
      titleIconClass = "titleIcon notitleIcon";
    } else if (this.props.title !== "NONE") {
      title = this.props.title;
    } else {
      return <div className={"left titel " + titleIconClass}></div>;
    }



    return (
      <div
        className={"left titel " + titleIconClass + " " + compactModeClass}
        style={{ fontSize }}
      >
        <span
          className={
            "titleIcon " +
            compactModeClass +
            " " +
            titleIconFamily +
            " " +
            titleIcon
          }
        ></span>
        <span className={"titletext"}>{title}</span>
      </div>
    );
  }
}
