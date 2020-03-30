import React from "react";

export default class Title extends React.Component {
    render() {
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
            <div className="left titel titleIcon">
                <span className={"titleIcon mfd-icon " + titleIcon}></span>
                {title}
            </div>
        )
    }
}