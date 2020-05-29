import React from "react";

export default class Title extends React.Component {
    render() {

        let fontSize = "100%";
        let compactModeClass = "";

        if (this.props.compactMode === true) {
            fontSize = "80%";
            compactModeClass = "compactMode";
        }

        let title = "";
        if (this.props.title === "ICONONLY") {
            title = "";
        }
        else if (this.props.title !== "NONE") {
            title = this.props.title;
        }
        else {
            return (
                <div className="left titel titleIcon">
                </div>
            )
        };
        let titleIcon = this.props.titleIcon || "audio_play";
        return (
            <div
                className={"left titel titleIcon " + compactModeClass}
                style={{ fontSize }}
            >
                <span className={"titleIcon mfd-icon " + compactModeClass + " " + titleIcon}></span>
                {title}
            </div>
        )
    }
}