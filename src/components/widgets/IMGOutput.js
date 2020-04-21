import React from "react";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class IMGOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imgkey: 0, lastUpdateDate: Date.now() };
    setInterval(
      () =>
        this.setState((s) => ({
          imgkey: s.imgkey + 1,
          lastUpdateDate: Date.now(),
        })),
      this.props.IMGUpdateInterval
    );
  }

  render() {
    let title = (
      <ons-list-item>
        <Title title={this.props.title} titleIcon={this.props.titleIcon} />
      </ons-list-item>
    );
    let imgAltDesc = this.props.title;

    if (this.props.title == "NONE") {
      title = null;
      imgAltDesc = "--";
    }

    return (
      <ons-col id={this.props.UUID} class={"imgoutput"}>
        <ons-list>
          <ons-list-header>
            <span
              className="right lastupdate"
              style={{ float: "right", paddingRight: "5px" }}
            >
              {moment(this.state.lastUpdateDate).format("LLL")}
            </span>
          </ons-list-header>
          {title}
          <ons-list-item>
            <div className="imgoutput">
              <img
                key={this.state.imgKey}
                src={this.props.IMGUrl + "?ts=" + this.state.lastUpdateDate}
                alt={imgAltDesc}
              />
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
