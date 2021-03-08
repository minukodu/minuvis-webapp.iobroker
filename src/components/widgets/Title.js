import React from "react";

export default class Title extends React.Component {
  render() {
    let compactModeClass = "";
    let titleIconClass = "titleIcon";

    let fontSize = this.props.fontSize || 100;

    let title = "";
    let titleText = this.props.title || "NONE";
    let titleIcon = this.props.titleIcon || "audio_play";
    let titleIconFamily = this.props.titleIconFamily || "mfd-icon";

    if (titleText === "ICONONLY") {
      title = "";
    } else if (titleText.indexOf("NOICON_") == 0) {
      title = titleText.substr(7); // cut 7 characters
      titleIconClass = "titleIcon notitleIcon";
    } else if (titleText !== "NONE") {
      title = titleText;
    } else {
      return <div className={"left titel " + titleIconClass}></div>;
    }



    return (
      <div
        className={"titel " + titleIconClass}
        style={{ fontSize: fontSize + "%" }}
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
        <span className={"titletext"} >{title}</span>
      </div>
    );
  }
}
