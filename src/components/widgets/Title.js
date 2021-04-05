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

    let paddingLeft = 0;
    if (titleText === "ICONONLY") {
      title = "";
    } else if (titleText.indexOf("NOICON_") == 0) {
      title = titleText.substr(7); // cut 7 characters
      titleIconClass = "titleIcon notitleIcon";
      paddingLeft = 10;
    } else if (titleIconFamily === "noIcon") {
      titleIconClass = "titleIcon notitleIcon";
      title = titleText;
      paddingLeft = 10;
    } else if (titleText !== "NONE") {
      title = titleText;
    } else {
      return <div className={"left titel " + titleIconClass}></div>;
    }
    let transform = "scale(" + fontSize / 100 + ") translate(" + (fontSize - 100) * 0 + "px, " + (fontSize - 100) * 0.07 + "px)";
    let iconSize = 55*fontSize/100;
    let iconFontSize = 35*fontSize/100;
    let widgetHeight = this.props.widgetHeight * 67;
    let marginTop = (widgetHeight - iconSize) /2;
    

    return (
      <div
        className={"title " + titleIconClass + " " + this.props.classes}
        style={{ fontSize: fontSize + "%", padding: 0, paddingLeft: paddingLeft + "px"}}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center", marginTop: marginTop + "px", marginRight: "10px", }}>
          <div
            style={{ fontSize: iconFontSize + "px", lineHeight: (iconSize + iconFontSize)/2 - 5 +"px", width: iconSize +"px", height: iconSize +"px",  }}
            className={
              "titleIcon " +
              compactModeClass +
              " " +
              titleIconFamily +
              " " +
              titleIcon
            }
          ></div>
          <div className={"titletext"} >{title}</div>
        </div>
      </div>
    );
  }
}
