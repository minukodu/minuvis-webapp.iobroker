import React from "react";
import Title from "./Title";
import moment from "moment";
moment.locale("de-DE");

export default class HtmlOutput extends React.Component {
  constructor() {
    super();
    this._stateId_subscribed = false;
    this.state = {
      val: "no data",
      ts: moment()
    };
  }

  componentWillMount() {
    // console.dir(this.props.states);
    // console.log(typeof this.props.states[this.props.stateId]);

    if (typeof this.props.states[this.props.stateId] === "undefined") {
      if (this._stateId_subscribed === false) {
        // Subscribe state
        // console.log("Subscribe " + this.props.stateId);
        this.props.socket.emit("subscribe", this.props.stateId);
        this._stateId_subscribed = true;
        // Read state
        this.props.socket.emit(
          "getStates",
          [this.props.stateId],
          function (err, states) {
            // console.log("Received States");
            // console.dir(states);
            // eintragen
            this.setState({
              val: states[this.props.stateId].val,
              ts: states[this.props.stateId].ts
            });
          }.bind(this)
        );
      }
    } else {
      // console.log("Read " + this.props.stateId);
      this.setState({
        val: this.props.states[this.props.stateId].val,
        ts: this.props.states[this.props.stateId].ts
      });
    }

    // console.log("Switch connected:");
    // console.log(this.props);
    // console.log(this.props.connected);
    // console.log(!this.props.connected);
  }

  render() {
    //console.debug("Render HTMLOutput");

    // init
    let val = "no data";
    let ts = moment();
    // read value and timestamp from props if available
    if (typeof this.props.states[this.props.stateId] !== "undefined") {
      val = this.props.states[this.props.stateId].val;
      ts = this.props.states[this.props.stateId].ts;
    } else {
      // read from this.state
      val = this.state.val;
      ts = this.state.ts;
    }

    // inject css
    let styleToInject = ""; // now globally in myPage.js "<style>" + CSSJSON.toCSS(this.props.css) + "</style>";

    val = styleToInject + val;

    let title =
      <ons-list-item>
        <Title title={this.props.title} titleIcon={this.props.titleIcon} />
      </ons-list-item>

    if (this.props.title == "NONE") {
      title = null;
    }

    return (
      <ons-col id={this.props.UUID}>
        <ons-list>
          <ons-list-header>
            <span
              className="right lastupdate"
              style={{ float: "right", paddingRight: "5px" }}
            >
              {moment(ts).format("LLL")}
            </span>
          </ons-list-header>
          {title}
          <ons-list-item>
            <div style={{ width: 100 + "%" }}>
              <div
                className="htmloutput"
                style={{ width: 100 + "%" }}
                dangerouslySetInnerHTML={{ __html: val }}
              ></div>
            </div>
          </ons-list-item>
        </ons-list>
      </ons-col>
    );
  }
}
